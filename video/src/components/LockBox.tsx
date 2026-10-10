import React from 'react';
import {useCurrentFrame} from 'remotion';
import {spr} from '../anim';
import {C, FONT} from '../theme';
import {useLayout} from '../layout';

/** Bracket lock-on frame: [ text ] with an optional signal tag. Animates when `at` (sec, scene-local) is reached. */
export const LockBox: React.FC<{children: React.ReactNode; at: number; tag?: string; color?: string; tagBelow?: boolean}> = ({children, at, tag, color = C.lime, tagBelow = true}) => {
  const frame = useCurrentFrame();
  const {u} = useLayout();
  const p = spr(frame, at, {damping: 12, stiffness: 220});
  const on = p > 0.01;
  const pad = 6 * u + (1 - p) * 26 * u;
  const corner = 14 * u;
  const bw = Math.max(2, 3 * u);
  const br = (pos: React.CSSProperties): React.CSSProperties => ({position: 'absolute', width: corner, height: corner, borderColor: color, borderStyle: 'solid', borderWidth: 0, opacity: p, ...pos});
  return (
    <span style={{position: 'relative', display: 'inline-block', color: on ? color : 'inherit', textShadow: on ? `0 0 ${14 * u * p}px ${color}66` : 'none'}}>
      {children}
      {on && <>
        <span style={br({left: -pad, top: -pad * 0.7, borderLeftWidth: bw, borderTopWidth: bw})} />
        <span style={br({left: -pad, bottom: -pad * 0.7, borderLeftWidth: bw, borderBottomWidth: bw})} />
        <span style={br({right: -pad, top: -pad * 0.7, borderRightWidth: bw, borderTopWidth: bw})} />
        <span style={br({right: -pad, bottom: -pad * 0.7, borderRightWidth: bw, borderBottomWidth: bw})} />
        {tag && <span style={{position: 'absolute', left: -pad, [tagBelow ? 'top' : 'bottom']: '100%', marginTop: tagBelow ? 10 * u : 0, marginBottom: tagBelow ? 0 : 10 * u,
          fontFamily: FONT.mono, fontSize: 17 * u, letterSpacing: '0.05em', background: color, color: C.bg, padding: `${2 * u}px ${8 * u}px`, borderRadius: 3 * u,
          whiteSpace: 'nowrap', opacity: p, transform: `translateX(${(1 - p) * -12 * u}px)`, textShadow: 'none', fontWeight: 600}}>{tag}</span>}
      </>}
    </span>
  );
};
