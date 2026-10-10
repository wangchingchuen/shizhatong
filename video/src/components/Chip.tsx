import React from 'react';
import {C, FONT} from '../theme';

/** Silicon chip icon with pins. `active` 0..1 lights the die. */
export const Chip: React.FC<{size: number; label: string; sub?: string; active?: number}> = ({size, label, sub, active = 1}) => {
  const pins = 9;
  const pin = (i: number, side: number) => {
    const p = 0.16 + (i / (pins - 1)) * 0.68;
    const L = size * 0.1, T = size * 0.022;
    const common: React.CSSProperties = {position: 'absolute', background: active > 0.5 ? C.limeDim : C.lineStrong};
    if (side === 0) return <div key={`t${i}`} style={{...common, left: p * size - T / 2, top: -L, width: T, height: L}} />;
    if (side === 1) return <div key={`b${i}`} style={{...common, left: p * size - T / 2, bottom: -L, width: T, height: L}} />;
    if (side === 2) return <div key={`l${i}`} style={{...common, top: p * size - T / 2, left: -L, width: L, height: T}} />;
    return <div key={`r${i}`} style={{...common, top: p * size - T / 2, right: -L, width: L, height: T}} />;
  };
  return (
    <div style={{position: 'relative', width: size, height: size, borderRadius: size * 0.06, background: 'linear-gradient(145deg,#1a332b,#0b1813)', border: `1px solid ${C.lineStrong}`,
      boxShadow: `0 0 ${size * 0.25 * active}px rgba(220,237,165,${0.22 * active})`}}>
      {[0, 1, 2, 3].map(s => Array.from({length: pins}, (_, i) => pin(i, s)))}
      <div style={{position: 'absolute', inset: size * 0.16, borderRadius: size * 0.03, border: `1px solid rgba(220,237,165,${0.2 + 0.6 * active})`,
        background: `repeating-linear-gradient(0deg, rgba(220,237,165,${0.04 * active}) 0 2px, transparent 2px ${size * 0.04}px)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: size * 0.03}}>
        <div style={{fontFamily: FONT.mono, fontWeight: 600, fontSize: size * 0.085, color: C.lime, opacity: 0.4 + 0.6 * active, letterSpacing: '0.04em', textAlign: 'center'}}>{label}</div>
        {sub && <div style={{fontFamily: FONT.tc, fontSize: size * 0.06, color: C.textDim}}>{sub}</div>}
      </div>
    </div>
  );
};
