import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ramp, spr} from '../anim';
import {C, FONT} from '../theme';
import {useLayout} from '../layout';
import {GridBg} from '../components/GridBg';
import {LockBox} from '../components/LockBox';
import {MonoLabel} from '../components/MonoLabel';
import risk from '../data/risk.json';

/** 句12 — split comparison: a safety reminder [提醒] vs. a real request [索取] (results from analyze()). */
export const Contrast: React.FC = () => {
  const frame = useCurrentFrame();
  const {W, H, V, u} = useLayout();
  const split = spr(frame, 0, {damping: 20, stiffness: 90});
  const [safe, ask] = risk.contrast;
  const side = (text: string, tag: string, color: string, at: number, code: string, desc: string) => {
    const p = spr(frame, at - 0.3, {damping: 18});
    return (
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 34 * u, opacity: 0.3 + 0.7 * p}}>
        <MonoLabel size={18} color={C.textFaint}>{code}</MonoLabel>
        <div style={{fontFamily: FONT.tc, fontWeight: 700, fontSize: (V ? 60 : 64) * u, color: C.text}}>
          <LockBox at={at} color={color}>「{text}」</LockBox>
        </div>
        <div style={{fontFamily: FONT.mono, fontWeight: 600, fontSize: 30 * u, color: C.bg, background: color, padding: `${6 * u}px ${20 * u}px`, borderRadius: 6 * u, opacity: ramp(frame, [at * 30, at * 30 + 6]), letterSpacing: '0.06em'}}>[{tag}]</div>
        <div style={{fontFamily: FONT.tc, fontSize: 26 * u, color: C.textDim, opacity: ramp(frame, [at * 30 + 6, at * 30 + 14])}}>{desc}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <GridBg />
      <AbsoluteFill style={{flexDirection: V ? 'column' : 'row', paddingBottom: V ? H * 0.16 : H * 0.1, paddingTop: V ? H * 0.06 : H * 0.04}}>
        {side(safe.text, '提醒', C.green, 1.6, `safety = ${safe.safety}`, '判定為善意的提醒')}
        <div style={{alignSelf: 'center', background: C.lineStrong, ...(V ? {height: 2, width: `${split * 80}%`} : {width: 2, height: `${split * 70}%`})}} />
        {side(ask.text, '索取', C.brick, 3.2, `hit = ${ask.hits.join(',')}`, '判定為真正的索取')}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
