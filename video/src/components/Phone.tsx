import React from 'react';
import {C} from '../theme';

/** Phone body drawn in HTML/CSS. `w` = outer width in px. Children render inside the screen. */
export const Phone: React.FC<{w: number; children?: React.ReactNode; screenBg?: string; glow?: number; style?: React.CSSProperties; shake?: number}> = ({w, children, screenBg = '#0d211b', glow = 0.6, style, shake = 0}) => {
  const h = w * 2.05;
  const r = w * 0.14;
  const b = w * 0.035;
  return (
    <div style={{position: 'relative', width: w, height: h, borderRadius: r, background: 'linear-gradient(150deg,#1d2b26 0%,#070f0c 45%,#0c1814 100%)',
      boxShadow: `0 ${w * 0.08}px ${w * 0.25}px rgba(0,0,0,0.6), inset 0 0 0 ${Math.max(1, w * 0.004)}px rgba(220,237,165,0.25)`,
      transform: shake ? `translate(${shake}px, ${-shake * 0.4}px) rotate(${shake * 0.08}deg)` : undefined, ...style}}>
      {/* side buttons */}
      <div style={{position: 'absolute', right: -w * 0.012, top: h * 0.22, width: w * 0.014, height: h * 0.1, background: '#1a2722', borderRadius: 2}} />
      <div style={{position: 'absolute', left: -w * 0.012, top: h * 0.18, width: w * 0.014, height: h * 0.06, background: '#1a2722', borderRadius: 2}} />
      <div style={{position: 'absolute', inset: b, borderRadius: r - b, overflow: 'hidden', background: screenBg,
        boxShadow: glow ? `0 0 ${w * 0.3 * glow}px rgba(220,237,165,${0.25 * glow})` : undefined}}>
        {children}
        {/* dynamic island */}
        <div style={{position: 'absolute', top: w * 0.035, left: '50%', width: w * 0.28, height: w * 0.075, marginLeft: -w * 0.14, borderRadius: w, background: '#020504'}} />
        {/* glass reflection, directional */}
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 32%)', pointerEvents: 'none'}} />
      </div>
    </div>
  );
};
