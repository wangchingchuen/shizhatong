import React from 'react';
import {C, FONT} from '../theme';

/** 識詐通 logo: dark rounded square with the character 識. */
export const Logo: React.FC<{size: number; glow?: number; style?: React.CSSProperties}> = ({size, glow = 0.5, style}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.24, background: 'linear-gradient(160deg,#16372d,#0a1914)',
    border: `${Math.max(1.5, size * 0.018)}px solid rgba(220,237,165,0.75)`, display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: `0 0 ${size * 0.35 * glow}px rgba(220,237,165,${0.35 * glow}), inset 0 ${size * 0.02}px 0 rgba(255,255,255,0.06)`, ...style}}>
    <span style={{fontFamily: FONT.tc, fontWeight: 900, fontSize: size * 0.58, color: C.lime, lineHeight: 1, transform: `translateY(${-size * 0.02}px)`}}>識</span>
  </div>
);

/** Expanding lime ring pulse. t = seconds since pulse start. */
export const PulseRing: React.FC<{size: number; t: number; rings?: number}> = ({size, t, rings = 2}) => (
  <>
    {Array.from({length: rings}, (_, i) => {
      const k = t - i * 0.35;
      if (k < 0 || k > 1.6) return null;
      const p = k / 1.6;
      const s = size * (1 + p * 2.2);
      return <div key={i} style={{position: 'absolute', left: '50%', top: '50%', width: s, height: s, marginLeft: -s / 2, marginTop: -s / 2,
        borderRadius: s * 0.3 * (1 - p) + s * 0.5 * p, border: `${Math.max(1.5, size * 0.02 * (1 - p))}px solid ${C.lime}`, opacity: (1 - p) * 0.9}} />;
    })}
  </>
);
