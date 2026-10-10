import React from 'react';
import {C, FONT} from '../theme';

/** Oscilloscope-style signal channel. Spike when the signal fires at `at`; latches lit afterwards. */
export const SignalChannel: React.FC<{w: number; h: number; t: number; at: number; name: string; code: string; source: string; u: number}> = ({w, h, t, at, name, code, source, u}) => {
  const lit = t >= at;
  const labelW = 230 * u;
  const tw = w - labelW;
  const N = 160;
  const pts = Array.from({length: N}, (_, i) => {
    const x = (i / (N - 1)) * tw;
    const tt = t - (1 - i / (N - 1)) * 2.2; // 2.2 s window, right = now
    const noise = Math.sin(tt * 31 + i) * 0.04 + Math.sin(tt * 13.7) * 0.03;
    const d = tt - at;
    const spike = d > 0 && d < 0.35 ? Math.sin((d / 0.35) * Math.PI) * 0.85 : 0;
    const level = tt >= at ? 0.12 : 0;
    return `${i ? 'L' : 'M'}${x},${h / 2 - (noise + spike + level) * h * 0.5}`;
  }).join(' ');
  return (
    <div style={{display: 'flex', alignItems: 'center', width: w, height: h}}>
      <div style={{width: labelW, display: 'flex', flexDirection: 'column', gap: 4 * u}}>
        <div style={{fontFamily: FONT.mono, fontSize: 15 * u, color: lit ? C.lime : C.textFaint, letterSpacing: '0.1em'}}>{code}</div>
        <div style={{fontFamily: FONT.tc, fontWeight: 700, fontSize: 30 * u, color: lit ? C.text : C.textFaint}}>{name}</div>
        <div style={{fontFamily: FONT.mono, fontSize: 14 * u, color: C.textFaint}}>{source}</div>
      </div>
      <svg width={tw} height={h} style={{border: `1px solid ${lit ? C.limeDim : C.line}`, borderRadius: 6 * u, background: lit ? 'rgba(220,237,165,0.05)' : 'transparent'}}>
        {Array.from({length: 11}, (_, i) => <line key={i} x1={(i / 10) * tw} x2={(i / 10) * tw} y1={0} y2={h} stroke={C.line} />)}
        <line x1={0} x2={tw} y1={h / 2} y2={h / 2} stroke={C.line} />
        <path d={pts} fill="none" stroke={lit ? C.lime : 'rgba(220,237,165,0.35)'} strokeWidth={2.2 * u} style={lit ? {filter: `drop-shadow(0 0 ${5 * u}px rgba(220,237,165,0.7))`} : undefined} />
      </svg>
    </div>
  );
};
