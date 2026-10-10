import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ramp} from '../anim';
import {C, FONT} from '../theme';
import {RollingNumber} from './RollingNumber';

/** Risk-index line chart. points: [minute, value, revealSec]. Values come from dist/engine.js (src/data/risk.json). */
export const RiskChart: React.FC<{w: number; h: number; points: {min: number; label: string; value: number; at: number}[]; maxMin?: number; threshold?: number; u: number; numSize?: number}> = ({w, h, points, maxMin = 10, threshold, u, numSize = 110}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const X = (m: number) => (m / maxMin) * w;
  const Y = (v: number) => h - (v / 100) * h;
  // animated value at each point
  const anim = points.map((p, i) => {
    const prev = i === 0 ? 0 : points[i - 1].value;
    return {...p, k: ramp(frame, [p.at * 30, (p.at + 0.8) * 30]), v: prev + (p.value - prev) * ramp(frame, [p.at * 30, (p.at + 0.8) * 30])};
  });
  const shown = anim.filter(p => t >= p.at);
  const current = shown.length ? shown[shown.length - 1].v : 0;
  const path = shown.map((p, i) => {
    const prev = i === 0 ? {min: 0, v: 0} : {min: shown[i - 1].min, v: shown[i - 1].value};
    const x = X(prev.min) + (X(p.min) - X(prev.min)) * (i === 0 ? 1 : p.k);
    return `${i === 0 ? `M${X(p.min)},${Y(0)} L` : 'L'}${x},${Y(p.v)}`;
  }).join(' ');
  const cur = shown[shown.length - 1];
  return (
    <div style={{position: 'relative', width: w}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 12 * u, marginBottom: 22 * u}}>
        <RollingNumber value={current} size={numSize * u} color={C.lime} />
        <div style={{fontFamily: FONT.tc, fontSize: 22 * u, color: C.textDim, lineHeight: 1.3}}>風險指標<br /><span style={{fontFamily: FONT.mono, fontSize: 15 * u, color: C.textFaint}}>RISK INDEX · 非機率</span></div>
      </div>
      <svg width={w} height={h + 40 * u} style={{overflow: 'visible'}}>
        {[0, 25, 50, 75, 100].map(v => <line key={v} x1={0} x2={w} y1={Y(v)} y2={Y(v)} stroke={C.line} />)}
        {threshold !== undefined && <>
          <line x1={0} x2={w} y1={Y(threshold)} y2={Y(threshold)} stroke={C.limeDim} strokeDasharray={`${6 * u} ${6 * u}`} />
          <text x={w} y={Y(threshold) - 8 * u} textAnchor="end" fill={C.limeDim} fontFamily={FONT.tc} fontSize={15 * u}>提醒門檻</text>
        </>}
        <path d={path} fill="none" stroke={C.lime} strokeWidth={3 * u} strokeLinejoin="round" style={{filter: `drop-shadow(0 0 ${6 * u}px rgba(220,237,165,0.6))`}} />
        {shown.map((p, i) => <circle key={i} cx={X(p.min)} cy={Y(p.v)} r={(i === shown.length - 1 ? 7 : 5) * u * Math.min(1, p.k * 3)} fill={C.bg} stroke={C.lime} strokeWidth={2.5 * u} />)}
        {points.map((p, i) => (
          <g key={i} opacity={t >= p.at ? 1 : 0.3}>
            <line x1={X(p.min)} x2={X(p.min)} y1={h} y2={h + 8 * u} stroke={C.limeDim} />
            <text x={X(p.min)} y={h + 32 * u} textAnchor="middle" fill={t >= p.at ? C.lime : C.textFaint} fontFamily={FONT.mono} fontSize={18 * u}>{p.label}</text>
          </g>
        ))}
        {cur && <text x={Math.min(w - 10 * u, X(cur.min) + 14 * u)} y={Y(cur.v) - 14 * u} fill={C.text} fontFamily={FONT.mono} fontSize={18 * u} textAnchor={X(cur.min) > w * 0.7 ? 'end' : 'start'}>{Math.round(cur.v)}</text>}
      </svg>
    </div>
  );
};
