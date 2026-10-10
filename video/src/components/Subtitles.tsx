import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ramp} from '../anim';
import {C, FONT} from '../theme';
import {useLayout} from '../layout';
import {FPS, SCENES, sceneStart} from '../timeline';

/** Vertical: break long lines at the comma closest to the middle so each line stays whole. */
const splitLine = (text: string) => {
  if (text.length <= 17) return text;
  const marks = [...text].map((c, i) => ('，：、'.includes(c) ? i : -1)).filter(i => i > 0 && i < text.length - 2);
  if (!marks.length) return text;
  const mid = text.length / 2;
  const at = marks.reduce((a, b) => (Math.abs(b - mid) < Math.abs(a - mid) ? b : a));
  return <>{text.slice(0, at + 1)}<br />{text.slice(at + 1)}</>;
};

/** Narration = conventional subtitle: centred, bottom, plain weight, soft backing. (Dialogue uses <LiveTranscript/>.) */
export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const {u, V, H} = useLayout();
  const t = frame / FPS;
  let current: {text: string; a: number; b: number} | null = null;
  for (const s of SCENES) for (const [a, b, text] of s.narration) {
    const A = sceneStart[s.id] + a, B = sceneStart[s.id] + b;
    if (t >= A && t < B) current = {text, a: A, b: B};
  }
  if (!current) return null;
  const fa = current.a * FPS, fb = current.b * FPS;
  const op = Math.min(ramp(frame, [fa, fa + 6]), ramp(frame, [fb - 6, fb], [1, 0]));
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: V ? H * 0.17 : H * 0.075, pointerEvents: 'none'}}>
      <div style={{maxWidth: V ? '90%' : '80%', textAlign: 'center', opacity: op, transform: `translateY(${(1 - op) * 6 * u}px)`,
        fontFamily: FONT.tc, fontWeight: 500, fontSize: (V ? 46 : 44) * u, lineHeight: 1.45, color: C.text, letterSpacing: '0.04em',
        background: 'rgba(6,16,13,0.62)', padding: `${10 * u}px ${28 * u}px`, borderRadius: 8 * u, textShadow: '0 2px 8px rgba(0,0,0,0.6)'}}>
        {V ? splitLine(current.text) : current.text}
      </div>
    </AbsoluteFill>
  );
};
