import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ramp, spr} from '../anim';
import {C, FONT} from '../theme';
import {useLayout} from '../layout';
import {GridBg} from '../components/GridBg';
import {Phone} from '../components/Phone';
import {CallScreen} from '../components/CallScreen';
import {AlertCard} from '../components/AlertCard';
import {MonoLabel} from '../components/MonoLabel';
import risk from '../data/risk.json';

/** 句6 — brick-orange edge flash; warning card drops into the call UI; three reason tags lock in sequence. */
export const Alert: React.FC = () => {
  const frame = useCurrentFrame();
  const {W, H, V, u} = useLayout();
  const t = frame / 30;
  const flash = Math.max(ramp(frame, [0, 3]) - ramp(frame, [4, 14]), 0);
  const drop = spr(frame, 0.5, {damping: 13, stiffness: 140});
  const pw = (V ? 520 : 400) * u;
  const s = pw * 0.93;
  const zoom = 1 + ramp(frame, [0, 180], [0, 0.05]);
  const score = risk.steps[2].score;
  return (
    <AbsoluteFill>
      <GridBg light={{x: V ? 0.5 : 0.42, y: 0.45, r: 0.45}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', transform: `scale(${zoom})`}}>
        <div style={{transform: V ? `translateY(${-H * 0.06}px)` : `translate(${-W * 0.1}px, ${-H * 0.04}px)`}}>
          <Phone w={pw} glow={0.7}>
            <CallScreen s={s} status="ON CALL" title="未知來電" sub="02-5550-0188" timer={`08:${String(Math.floor(t) + 2).padStart(2, '0')}`} guarding />
            <div style={{position: 'absolute', left: s * 0.05, right: s * 0.05, top: s * 0.2 + (1 - drop) * -s * 1.2, opacity: Math.min(1, drop * 2)}}>
              <AlertCard s={s * 0.9} tagsAt={[1.7, 2.3, 2.9]} />
            </div>
          </Phone>
        </div>
      </AbsoluteFill>
      {!V && (
        <div style={{position: 'absolute', left: W * 0.66, top: H * 0.34, display: 'flex', flexDirection: 'column', gap: 16 * u, opacity: ramp(frame, [20, 32])}}>
          <MonoLabel size={18} color={C.limeDim}>RISK INDEX · 風險指標</MonoLabel>
          <div style={{fontFamily: FONT.mono, fontWeight: 600, fontSize: 120 * u, color: C.lime, lineHeight: 1}}>{score}</div>
          <MonoLabel size={18} color={C.textFaint}>≥ 提醒門檻 · LEVEL {risk.steps[2].level.toUpperCase()}</MonoLabel>
          <MonoLabel size={18} color={C.textFaint}>SOURCE · dist/engine.js</MonoLabel>
        </div>
      )}
      {/* edge flash — brick orange */}
      <AbsoluteFill style={{boxShadow: `inset 0 0 ${160 * u}px ${30 * u}px rgba(193,113,76,${0.85 * flash})`, border: `${6 * u}px solid rgba(193,113,76,${flash})`, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
