import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ramp} from '../anim';
import {C, FONT} from '../theme';
import {useLayout} from '../layout';
import {GridBg} from '../components/GridBg';
import {MemoryGrid} from '../components/MemoryGrid';
import {RollingNumber} from '../components/RollingNumber';
import {MonoLabel} from '../components/MonoLabel';
import risk from '../data/risk.json';

/** 句17 — after hang-up the RAM block is swept top→bottom to 0x00; every value on the UI rolls to zero. */
export const Clear: React.FC = () => {
  const frame = useCurrentFrame();
  const {W, H, V, u} = useLayout();
  const sweep = ramp(frame, [0.5 * 30, 2.7 * 30], [0, 1], (x) => x);
  const zero = ramp(frame, [2.4 * 30, 3.0 * 30]);
  const last = risk.steps[risk.steps.length - 1];
  const stats = [
    {label: '風險指標', v: last.score},
    {label: '暫存句數', v: risk.steps.length},
    {label: '風險訊號', v: last.signals.length},
  ];
  const cell = (V ? 50 : 52) * u;
  return (
    <AbsoluteFill>
      <GridBg />
      <AbsoluteFill style={{flexDirection: V ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: (V ? 60 : 110) * u, paddingBottom: V ? H * 0.14 : H * 0.06}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 18 * u}}>
          <MonoLabel size={18} color={C.limeDim}>CALL ENDED · 暫存記憶體</MonoLabel>
          <MemoryGrid cols={V ? 14 : 16} rows={V ? 12 : 12} cell={cell} sweep={sweep} u={u} />
        </div>
        <div style={{display: 'flex', flexDirection: V ? 'row' : 'column', gap: (V ? 50 : 40) * u}}>
          {stats.map(s => (
            <div key={s.label} style={{display: 'flex', flexDirection: 'column', gap: 6 * u}}>
              <span style={{fontFamily: FONT.tc, fontSize: 24 * u, color: C.textDim}}>{s.label}</span>
              <RollingNumber value={s.v * (1 - zero)} size={(V ? 72 : 84) * u} color={zero >= 1 ? C.textDim : C.lime} />
            </div>
          ))}
          <MonoLabel size={18} color={C.lime} boxed style={{opacity: ramp(frame, [3.0 * 30, 3.3 * 30]), alignSelf: 'flex-start'}}>CLEARED · 已清除</MonoLabel>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
