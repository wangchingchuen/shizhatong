import React from 'react';
import {C, FONT} from '../theme';
import {hash} from '../anim';

/**
 * Circular buffer in RAM. Slot i is written at writeAt(i) and overwritten with 00 at clearAt(i).
 * t = scene seconds.
 */
export const RingBuffer: React.FC<{size: number; slots?: number; t: number; writeAt: (i: number) => number; clearAt: (i: number) => number; writes: number}> = ({size, slots = 12, t, writeAt, clearAt, writes}) => {
  const R = size / 2, r0 = R * 0.62, r1 = R * 0.95;
  const arc = (a0: number, a1: number) => {
    const p = (a: number, r: number) => `${R + r * Math.cos(a)},${R + r * Math.sin(a)}`;
    return `M${p(a0, r0)} L${p(a0, r1)} A${r1},${r1} 0 0 1 ${p(a1, r1)} L${p(a1, r0)} A${r0},${r0} 0 0 0 ${p(a0, r0)} Z`;
  };
  // latest write index
  let head = -1;
  for (let k = 0; k < writes; k++) if (t >= writeAt(k)) head = k;
  return (
    <svg width={size} height={size} style={{overflow: 'visible'}}>
      {Array.from({length: slots}, (_, s) => {
        const a0 = -Math.PI / 2 + (s / slots) * Math.PI * 2 + 0.03, a1 = a0 + (Math.PI * 2) / slots - 0.06;
        // most recent write landing in slot s
        let k = -1;
        for (let q = s; q <= head; q += slots) k = q;
        const written = k >= 0;
        const cleared = written && t >= clearAt(k);
        const sinceClear = cleared ? t - clearAt(k) : 99;
        const flash = sinceClear < 0.3;
        const fill = written && !cleared ? 'rgba(220,237,165,0.75)' : flash ? 'rgba(244,246,242,0.9)' : 'rgba(220,237,165,0.06)';
        const mid = (a0 + a1) / 2, rm = (r0 + r1) / 2;
        const val = !written ? '··' : cleared ? '00' : (Math.floor(hash(k) * 200) + 40).toString(16).toUpperCase().padStart(2, '0');
        return (
          <g key={s}>
            <path d={arc(a0, a1)} fill={fill} stroke={C.lineStrong} strokeWidth={1} />
            <text x={R + rm * Math.cos(mid)} y={R + rm * Math.sin(mid) + size * 0.014} textAnchor="middle" fontFamily={FONT.mono} fontWeight={600} fontSize={size * 0.04}
              fill={written && !cleared ? C.bg : flash ? C.bg : C.textFaint}>{val}</text>
          </g>
        );
      })}
      {head >= 0 && (() => {
        const a = -Math.PI / 2 + ((head % slots + 0.5) / slots) * Math.PI * 2;
        return <line x1={R} y1={R} x2={R + R * 1.05 * Math.cos(a)} y2={R + R * 1.05 * Math.sin(a)} stroke={C.lime} strokeWidth={2} opacity={0.7} />;
      })()}
      <circle cx={R} cy={R} r={r0 * 0.82} fill={C.bg} stroke={C.lineStrong} />
      <text x={R} y={R - size * 0.03} textAnchor="middle" fontFamily={FONT.mono} fontSize={size * 0.045} fill={C.limeDim} letterSpacing="2">RING BUFFER</text>
      <text x={R} y={R + size * 0.05} textAnchor="middle" fontFamily={FONT.tc} fontSize={size * 0.055} fill={C.text}>手機記憶體</text>
    </svg>
  );
};
