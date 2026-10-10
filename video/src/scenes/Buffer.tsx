import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ramp, spr} from '../anim';
import {C, FONT} from '../theme';
import {useLayout} from '../layout';
import {GridBg} from '../components/GridBg';
import {RingBuffer} from '../components/RingBuffer';
import {Waveform} from '../components/Waveform';
import {MonoLabel} from '../components/MonoLabel';

const writeAt = (i: number) => 0.5 + i * 0.3;
const clearAt = (i: number) => writeAt(i) + 1.05; // processed → overwritten with 00

/** 句9 — ring buffer fills slot by slot; processed slots flash to 00. No recording file is created. */
export const Buffer: React.FC = () => {
  const frame = useCurrentFrame();
  const {W, H, V, u} = useLayout();
  const t = frame / 30;
  const size = (V ? 640 : 560) * u;
  const noFile = spr(frame, 2.2, {damping: 14});
  const strike = ramp(frame, [2.6 * 30, 2.9 * 30]);
  return (
    <AbsoluteFill>
      <GridBg light={{x: 0.5, y: 0.45, r: 0.5}} />
      <AbsoluteFill style={{flexDirection: V ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: (V ? 40 : 90) * u, paddingBottom: V ? H * 0.12 : H * 0.06}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 * u}}>
          <MonoLabel size={18} color={C.limeDim}>AUDIO FRAMES · 20 ms</MonoLabel>
          <Waveform w={(V ? 520 : 300) * u} h={110 * u} bars={30} level={() => 0.7} />
          <div style={{fontFamily: FONT.mono, fontSize: 40 * u, color: C.limeDim, transform: V ? 'rotate(90deg)' : undefined}}>→</div>
        </div>
        <RingBuffer size={size} slots={12} t={t} writeAt={writeAt} clearAt={clearAt} writes={18} />
        <div style={{display: 'flex', flexDirection: 'column', gap: 22 * u, alignItems: V ? 'center' : 'flex-start'}}>
          <div style={{opacity: noFile, transform: `translateX(${(1 - noFile) * 30 * u}px)`, display: 'flex', alignItems: 'center', gap: 22 * u}}>
            <div style={{position: 'relative', width: 90 * u, height: 112 * u, border: `2px solid ${C.textDim}`, borderRadius: 8 * u, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 12 * u}}>
              <span style={{fontFamily: FONT.mono, fontSize: 18 * u, color: C.textDim}}>.wav</span>
              <div style={{position: 'absolute', left: -12 * u, top: '50%', width: (114 * strike) * u, height: 3 * u, background: C.text, transform: 'rotate(-38deg)', transformOrigin: 'left center'}} />
            </div>
            <div>
              <div style={{fontFamily: FONT.tc, fontWeight: 700, fontSize: 40 * u, color: C.text}}>不建立錄音檔</div>
              <MonoLabel size={16} color={C.textFaint} style={{marginTop: 8 * u}}>NO RECORDING FILE · RAM ONLY</MonoLabel>
            </div>
          </div>
          <MonoLabel size={18} color={C.limeDim} boxed style={{opacity: ramp(frame, [3.4 * 30, 3.8 * 30])}}>已處理 → 覆寫為 00</MonoLabel>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
