import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ramp} from '../anim';
import {C} from '../theme';
import {OVERLAP} from '../timeline';

/** Mask-scan transition: reveals children left→right behind a lime scan line during the first OVERLAP frames. */
export const ScanWipe: React.FC<{children: React.ReactNode; enabled: boolean}> = ({children, enabled}) => {
  const frame = useCurrentFrame();
  if (!enabled || frame >= OVERLAP) return <AbsoluteFill>{children}</AbsoluteFill>;
  const p = ramp(frame, [0, OVERLAP - 1], [0, 1]) * 100;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{clipPath: `inset(0 ${100 - p}% 0 0)`}}>{children}</AbsoluteFill>
      <AbsoluteFill style={{pointerEvents: 'none'}}>
        <div style={{position: 'absolute', top: 0, bottom: 0, left: `${p}%`, width: 3, marginLeft: -1.5, background: C.lime, boxShadow: `0 0 18px ${C.lime}, -40px 0 60px rgba(220,237,165,0.18)`}} />
        {Array.from({length: 24}, (_, i) => (
          <div key={i} style={{position: 'absolute', left: `${p}%`, top: `${(i / 24) * 100}%`, width: 30 + ((i * 37) % 70), height: 1, marginLeft: -100, background: 'rgba(220,237,165,0.35)'}} />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
