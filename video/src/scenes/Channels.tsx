import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ramp, spr} from '../anim';
import {C, FONT} from '../theme';
import {useLayout} from '../layout';
import {GridBg} from '../components/GridBg';
import {SignalChannel} from '../components/SignalChannel';
import {MonoLabel} from '../components/MonoLabel';

const CH = [
  {name: '權威', code: 'CH1 · AUTHORITY', source: '第 1 句 · 0:00', at: 0.9},
  {name: '保密', code: 'CH2 · SECRECY', source: '第 2 句 · 3:00', at: 1.8},
  {name: '資金', code: 'CH3 · MONEY', source: '第 3 句 · 8:00', at: 2.7},
];

/** 句13 — three oscilloscope channels; signals from different sentences latch; when all three are lit, the combination lamp turns on. */
export const Channels: React.FC = () => {
  const frame = useCurrentFrame();
  const {W, H, V, u} = useLayout();
  const t = frame / 30;
  const w = (V ? 940 : 1300) * u;
  const ch = (V ? 150 : 150) * u;
  const combo = spr(frame, 3.6, {damping: 10, stiffness: 160});
  return (
    <AbsoluteFill>
      <GridBg light={{x: 0.5, y: 0.4, r: 0.5, a: 0.4 + combo * 0.6}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: V ? H * 0.12 : H * 0.07}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 28 * u}}>
          <MonoLabel size={18} color={C.limeDim}>CROSS-SENTENCE SIGNALS · 跨句累積</MonoLabel>
          {CH.map(c => <SignalChannel key={c.code} w={w} h={ch} t={t} at={c.at} name={c.name} code={c.code} source={c.source} u={u} />)}
          <div style={{display: 'flex', alignItems: 'center', gap: 22 * u, marginTop: 12 * u, alignSelf: V ? 'center' : 'flex-end'}}>
            <span style={{fontFamily: FONT.tc, fontWeight: 700, fontSize: 32 * u, color: combo > 0.1 ? C.text : C.textFaint}}>組合加權</span>
            <div style={{width: 46 * u, height: 46 * u, borderRadius: '50%', border: `2px solid ${C.lime}`, background: combo > 0.1 ? C.lime : 'transparent',
              boxShadow: `0 0 ${combo * 36 * u}px rgba(220,237,165,0.8)`, transform: `scale(${0.8 + 0.2 * combo})`}} />
            <MonoLabel size={18} color={combo > 0.1 ? C.lime : C.textFaint}>{combo > 0.1 ? 'COMBINED · ON' : 'WAITING'}</MonoLabel>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
