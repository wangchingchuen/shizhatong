import React from 'react';
import {useCurrentFrame} from 'remotion';
import {typedCount} from '../anim';
import {C, FONT} from '../theme';
import {useLayout} from '../layout';
import {LockBox} from './LockBox';

export interface TranscriptLine {time: string; text: string; start: number; charSec: number; locks?: {word: string; tag: string; at: number; color?: string}[]}

/** Dialogue = "live transcript": monospace timecode, left-aligned, typed char by char with a cursor. */
export const LiveTranscript: React.FC<{lines: TranscriptLine[]; size?: number; dim?: boolean}> = ({lines, size = 34}) => {
  const frame = useCurrentFrame();
  const {u} = useLayout();
  const lastStarted = lines.reduce((a, l, i) => (frame / 30 >= l.start ? i : a), -1);
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 46 * u}}>
      {lines.map((l, i) => {
        const n = typedCount(frame, l.start, l.charSec, l.text.length);
        if (frame / 30 < l.start) return null;
        const done = n >= l.text.length;
        const blink = Math.floor(frame / 8) % 2 === 0;
        const visible = l.text.slice(0, n);
        // split into lockable segments
        const parts: React.ReactNode[] = [];
        let rest = visible;
        let key = 0;
        const locks = (l.locks ?? []).slice().sort((a, b) => l.text.indexOf(a.word) - l.text.indexOf(b.word));
        let cursorIdx = 0;
        for (const lk of locks) {
          const idx = l.text.indexOf(lk.word);
          if (idx < cursorIdx || idx + lk.word.length > visible.length) continue;
          parts.push(<span key={key++}>{visible.slice(cursorIdx, idx)}</span>);
          parts.push(<LockBox key={key++} at={lk.at} tag={lk.tag} color={lk.color}>{lk.word}</LockBox>);
          cursorIdx = idx + lk.word.length;
        }
        rest = visible.slice(cursorIdx);
        parts.push(<span key={key++}>{rest}</span>);
        return (
          <div key={i} style={{display: 'flex', gap: 18 * u, alignItems: 'baseline'}}>
            <span style={{fontFamily: FONT.mono, fontSize: size * 0.55 * u, color: C.limeDim, minWidth: 64 * u}}>{l.time}</span>
            <span style={{fontFamily: FONT.tc, fontWeight: 500, fontSize: size * u, color: C.text, lineHeight: 1.5, letterSpacing: '0.02em'}}>
              <span style={{fontFamily: FONT.mono, color: C.limeDim, fontSize: size * 0.7 * u, marginRight: 6 * u}}>›</span>
              {parts}
              {i === lastStarted && (!done || blink) && <span style={{display: 'inline-block', width: size * 0.5 * u, height: size * 0.95 * u, marginLeft: 4 * u, background: C.lime, verticalAlign: '-0.12em', opacity: done ? 0.6 : 1}} />}
            </span>
          </div>
        );
      })}
    </div>
  );
};
