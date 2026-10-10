import React from 'react';
import {C, FONT} from '../theme';

/** L1 scan raster: a band of moving horizontal lines. Text passes through it. */
export const Scanner: React.FC<{w: number; h: number; t: number; label?: string; hot?: number}> = ({w, h, t, label = 'L1 · 輕量初篩', hot = 0}) => (
  <div style={{position: 'relative', width: w, height: h}}>
    <div style={{position: 'absolute', inset: 0, border: `1px solid ${C.limeDim}`, borderRadius: 6,
      background: `repeating-linear-gradient(180deg, rgba(220,237,165,0.16) 0 2px, transparent 2px 9px)`, backgroundPosition: `0 ${(t * 60) % 9}px`,
      boxShadow: `inset 0 0 ${30 + hot * 40}px rgba(220,237,165,${0.12 + hot * 0.3})`}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: `${((t * 0.9) % 1) * 100}%`, height: 2, background: C.lime, boxShadow: `0 0 12px ${C.lime}`}} />
    <div style={{position: 'absolute', top: -34, left: 0, right: 0, textAlign: 'center', fontFamily: FONT.mono, fontSize: 18, color: C.lime, letterSpacing: '0.1em', whiteSpace: 'nowrap'}}>{label}</div>
  </div>
);
