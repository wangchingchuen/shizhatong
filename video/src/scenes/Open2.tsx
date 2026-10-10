import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ramp, spr} from '../anim';
import {C, FONT} from '../theme';
import {useLayout} from '../layout';
import {Phone} from '../components/Phone';
import {CallScreen} from '../components/CallScreen';
import {Silhouette} from '../components/Silhouette';
import {LockBox} from '../components/LockBox';
import {MonoLabel} from '../components/MonoLabel';
import {buzz} from './Open1';

/** 句2 — close-up: unknown number, answer slider slides open; grandma as silhouette (no face). */
export const Open2: React.FC = () => {
  const frame = useCurrentFrame();
  const {W, H, V, u} = useLayout();
  const t = frame / 30;
  const shake = buzz(t, [[0.3, 0.55], [1.15, 0.55]]) * 5 * u;
  const slide = ramp(frame, [2.6 * 30, 3.35 * 30]);
  const answered = t >= 3.4;
  const pw = (V ? 520 : 400) * u;
  const s = pw * 0.93;
  const push = 1 + ramp(frame, [0, 150], [0, 0.06]);
  const silIn = spr(frame, 0.9, {damping: 30, stiffness: 40});
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 60% 70% at 50% 55%, #11281f 0%, #060f0c 70%)', overflow: 'hidden'}}>
      {/* soft backlight on the wall so the silhouette reads */}
      <div style={{position: 'absolute', left: V ? W * 0.05 : W * 0.5, top: V ? H * 0.02 : H * 0.02, width: (V ? 1000 : 900) * u, height: (V ? 1000 : 900) * u,
        background: 'radial-gradient(circle at 50% 45%, rgba(220,237,165,0.22) 0%, rgba(220,237,165,0.06) 40%, transparent 70%)', opacity: silIn}} />
      {/* silhouette behind, out of focus (depth of field) */}
      <div style={{position: 'absolute', left: V ? W * 0.18 : W * 0.53, top: V ? H * 0.08 : H * 0.12, filter: `blur(${6 * u}px)`, opacity: 0.9 * silIn, transform: `translateY(${(1 - silIn) * 40 * u}px)`}}>
        <Silhouette h={(V ? 1100 : 1000) * u} who="grandma" rim="left" />
      </div>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', transform: `scale(${push})`}}>
        <div style={{transform: V ? undefined : `translateX(${-W * 0.12}px)`}}>
          <Phone w={pw} shake={shake} glow={0.9}>
            {!answered ? (
              <CallScreen s={s} status="INCOMING CALL" title="未知來電" incoming slide={slide}
                sub={undefined}>
                <div style={{marginTop: s * 0.04, fontFamily: FONT.mono, fontSize: s * 0.085, color: C.text, letterSpacing: '0.04em'}}>
                  <LockBox at={0.5} tag="未儲存的號碼">02-5550-0188</LockBox>
                </div>
              </CallScreen>
            ) : (
              <CallScreen s={s} status="ON CALL" title="未知來電" sub="02-5550-0188" timer={`00:0${Math.min(9, Math.floor(t - 3.4))}`} />
            )}
          </Phone>
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: W * (V ? 0.06 : 0.045), top: H * 0.12}}>
        <MonoLabel size={20} color={C.limeDim}>CALLER ID · UNKNOWN</MonoLabel>
      </div>
    </AbsoluteFill>
  );
};
