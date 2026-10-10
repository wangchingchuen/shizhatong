import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ramp, spr} from '../anim';
import {C, FONT} from '../theme';
import {useLayout} from '../layout';
import {GridBg} from '../components/GridBg';
import {Phone} from '../components/Phone';
import {CallScreen} from '../components/CallScreen';
import {AlertCard} from '../components/AlertCard';
import {Cursor} from '../components/Cursor';
import {LockBox} from '../components/LockBox';

/** 句14 — back on grandma's phone: cursor taps 「我知道了」; the call timer keeps running — no auto hang-up. */
export const Ack: React.FC = () => {
  const frame = useCurrentFrame();
  const {W, H, V, u} = useLayout();
  const t = frame / 30;
  const pw = (V ? 420 : 400) * u;
  const s = pw * 0.93;
  const gone = ramp(frame, [2.15 * 30, 2.6 * 30]);
  const secs = 24 + Math.floor(t);
  const card = s * 0.9;
  // cursor goes to the ack button (left button inside card)
  const target = {x: s * 0.05 + card * 0.28, y: s * 0.2 + card * 0.88};
  const k = ramp(frame, [0.5 * 30, 1.8 * 30]);
  const cur = {x: s * 0.85 + (target.x - s * 0.85) * k, y: s * 1.75 + (target.y - s * 1.75) * k};
  const label = spr(frame, 2.9, {damping: 14});
  return (
    <AbsoluteFill>
      <GridBg light={{x: 0.5, y: 0.45, r: 0.45}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{transform: V ? `translateY(${-H * 0.1}px)` : `translate(${-W * 0.1}px, ${-H * 0.04}px)`}}>
          <Phone w={pw} glow={0.7}>
            <CallScreen s={s} status="ON CALL" title="未知來電" sub="02-5550-0188" timer={`08:${String(secs).padStart(2, '0')}`} guarding />
            <div style={{position: 'absolute', left: s * 0.05, top: s * 0.2 - gone * s * 1.4, opacity: 1 - gone}}>
              <AlertCard s={card} tagsAt={[-1, -1, -1]} showAck ackPressed={t >= 2.0} />
            </div>
            {t < 2.6 && <Cursor x={cur.x} y={cur.y} size={34 * u} click={t >= 2.0 ? t - 2.0 : -1} />}
          </Phone>
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', ...(V ? {left: 0, right: 0, top: H * 0.645, textAlign: 'center'} : {left: W * 0.64, top: H * 0.38}), opacity: label}}>
        <div style={{fontFamily: FONT.mono, fontSize: 18 * u, color: C.limeDim, marginBottom: 16 * u}}>CALL TIMER · 08:{String(secs).padStart(2, '0')}</div>
        <div style={{fontFamily: FONT.tc, fontWeight: 900, fontSize: 52 * u, color: C.text}}><LockBox at={2.9}>不自動掛斷</LockBox></div>
        <div style={{fontFamily: FONT.tc, fontSize: 28 * u, color: C.textDim, marginTop: 26 * u}}>下一步，由你決定</div>
      </div>
    </AbsoluteFill>
  );
};
