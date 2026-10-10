import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';

/** Live voice waveform. `level(frameSec)` returns 0..1 speaking intensity. */
export const Waveform: React.FC<{w: number; h: number; bars?: number; level: (t: number) => number; color?: string; vertical?: boolean}> = ({w, h, bars = 48, level, color = C.lime}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const gap = w / bars;
  return (
    <svg width={w} height={h} style={{overflow: 'visible'}}>
      <line x1={0} x2={w} y1={h / 2} y2={h / 2} stroke={C.lineStrong} strokeWidth={1} />
      {Array.from({length: bars}, (_, i) => {
        // bars to the right are "now"; older to the left
        const tt = t - (bars - 1 - i) * 0.033;
        const lv = level(tt);
        const n = 0.5 + 0.5 * Math.sin(tt * 37 + i * 1.7) * Math.sin(tt * 11.3 + i * 0.6);
        const amp = Math.max(0.03, lv * (0.25 + 0.75 * n));
        const bh = amp * h * 0.92;
        return <rect key={i} x={i * gap + gap * 0.2} width={gap * 0.6} y={h / 2 - bh / 2} height={bh} rx={gap * 0.3}
          fill={color} opacity={0.25 + 0.75 * (i / bars)} />;
      })}
    </svg>
  );
};
