import React from 'react';
import {FONT} from '../theme';

/** Odometer-style rolling digits. `value` may be fractional while animating. */
export const RollingNumber: React.FC<{value: number; digits?: number; size: number; color: string; weight?: number}> = ({value, digits = 2, size, color, weight = 600}) => {
  const v = Math.max(0, value);
  const cols = Array.from({length: digits}, (_, i) => {
    const place = Math.pow(10, digits - 1 - i);
    // smooth roll of each column
    const raw = v / place;
    const base = Math.floor(raw) % 10;
    const frac = place === 1 ? raw - Math.floor(raw) : Math.max(0, (v % place) - (place - 1)) ;
    return base + Math.min(1, frac);
  });
  return (
    <span style={{display: 'inline-flex', fontFamily: FONT.mono, fontWeight: weight, fontSize: size, color, lineHeight: 1, height: size, overflow: 'hidden', fontVariantNumeric: 'tabular-nums'}}>
      {cols.map((c, i) => (
        <span key={i} style={{display: 'inline-block', height: size, overflow: 'hidden'}}>
          <span style={{display: 'flex', flexDirection: 'column', transform: `translateY(${-c * size}px)`}}>
            {Array.from({length: 11}, (_, d) => <span key={d} style={{height: size, lineHeight: `${size}px`}}>{d % 10}</span>)}
          </span>
        </span>
      ))}
    </span>
  );
};
