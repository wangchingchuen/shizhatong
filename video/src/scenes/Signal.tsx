import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {ramp, spr} from '../anim';
import {C, FONT} from '../theme';
import {useLayout} from '../layout';
import {CameraRig} from '../components/three/CameraRig';
import {CityWindows, DAUGHTER, GRANDMA, windowPos} from '../components/three/CityWindows';
import {SignalArc} from '../components/three/SignalArc';
import {projector} from '../components/three/project';
import {Phone} from '../components/Phone';
import {SmsNotification} from '../components/SmsNotification';
import {MonoLabel} from '../components/MonoLabel';
import {CLOCK, SMS_TEXT} from '../timeline';

const Stamp: React.FC<{x: number; y: number; who: string; on: number; u: number; align?: 'left' | 'right'}> = ({x, y, who, on, u, align = 'left'}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(${align === 'left' ? 0 : -100}%, -50%)`, opacity: on, display: 'flex', flexDirection: 'column', gap: 4 * u,
    alignItems: align === 'left' ? 'flex-start' : 'flex-end', background: 'rgba(6,16,13,0.75)', border: `1px solid ${C.limeDim}`, borderRadius: 6 * u, padding: `${8 * u}px ${14 * u}px`}}>
    <span style={{fontFamily: FONT.tc, fontSize: 20 * u, color: C.textDim, whiteSpace: 'nowrap'}}>{who}</span>
    <span style={{fontFamily: FONT.mono, fontWeight: 600, fontSize: 34 * u, color: C.lime}}>{CLOCK}</span>
  </div>
);

/** 句15 — at the alert, a lime signal line leaves grandma's window, crosses the facade, reaches the daughter's window; identical timestamps; SMS on her lock screen. */
export const Signal: React.FC = () => {
  const frame = useCurrentFrame();
  const {W, H, V, u} = useLayout();
  const t = frame / 30;
  const g = windowPos(...GRANDMA), d = windowPos(...DAUGHTER);
  const mid: [number, number, number] = [(g[0] + d[0]) / 2, (g[1] + d[1]) / 2, 0];
  const drift = ramp(frame, [0, 225], [0, 1]);
  const pos: [number, number, number] = V ? [mid[0] - 3 + drift * 2, mid[1] - 14, 52 - drift * 3] : [mid[0] - 2 + drift * 3, mid[1] - 4, 50 - drift * 4];
  const look: [number, number, number] = V ? [mid[0], mid[1] - 12, 0] : [mid[0] + 7, mid[1] - 1.5, 0];
  const fov = V ? 62 : 40;
  const P = projector(pos, look, fov, W, H);
  const gp = P(g), dp = P(d);
  const prog = ramp(frame, [0.75 * 30, 2.1 * 30]);
  const ping = spr(frame, 0.6, {damping: 12});
  const recv = spr(frame, 2.15, {damping: 12});
  const notif = spr(frame, 2.2, {damping: 14, stiffness: 140});
  const pw = (V ? 320 : 340) * u, s = pw * 0.93;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <ThreeCanvas width={W} height={H} style={{position: 'absolute'}}>
        <color attach="background" args={['#050c0a']} />
        <fog attach="fog" args={['#050c0a', 30, 160]} />
        <CameraRig pos={pos} look={look} fov={fov} />
        <CityWindows frame={frame} highlight={[GRANDMA, DAUGHTER]} />
        <SignalArc a={g} b={d} progress={prog} />
      </ThreeCanvas>
      {/* window rings */}
      {[[gp, ping], [dp, recv]].map(([p, k], i) => {
        const pp = p as {x: number; y: number}; const kk = k as number;
        if (kk < 0.01) return null;
        return <div key={i} style={{position: 'absolute', left: pp.x - 40 * u, top: pp.y - 40 * u, width: 80 * u, height: 80 * u, border: `2px solid ${C.lime}`, borderRadius: 8 * u, opacity: kk, transform: `scale(${1.6 - 0.6 * kk})`}} />;
      })}
      <Stamp x={V ? gp.x - 30 * u : gp.x - 60 * u} y={gp.y + (V ? 110 : 90) * u} who="阿嬤的手機 · 警示觸發" on={ping} u={u} align={V ? "left" : "right"} />
      <Stamp x={dp.x + 60 * u} y={dp.y - (V ? 100 : 80) * u} who="女兒的手機 · 收到簡訊" on={recv} u={u} align={V ? 'right' : 'left'} />
      {/* daughter's lock screen */}
      <div style={{position: 'absolute', ...(V ? {right: W * 0.06, top: H * 0.42} : {right: W * 0.06, bottom: H * 0.12}), opacity: Math.min(1, notif * 1.4), transform: `translateY(${(1 - notif) * 40 * u}px)`}}>
        <Phone w={pw} glow={0.6}>
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#123027,#0b1c17)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: s * 0.22}}>
            <div style={{fontFamily: FONT.mono, fontWeight: 600, fontSize: s * 0.2, color: C.text}}>21:08</div>
            <div style={{fontFamily: FONT.tc, fontSize: s * 0.05, color: C.textDim, marginBottom: s * 0.08}}>鎖定畫面</div>
            <div style={{transform: `translateY(${(1 - notif) * -s * 0.5}px)`}}><SmsNotification s={s * 0.9} text={SMS_TEXT} time={CLOCK.slice(0, 5)} /></div>
          </div>
          <div style={{position: 'absolute', right: s * 0.06, bottom: s * 0.06, fontFamily: FONT.tc, fontSize: s * 0.04, color: C.textFaint}}>示意畫面</div>
        </Phone>
        <div style={{position: 'absolute', left: 0, right: 0, top: -48 * u, display: 'flex', justifyContent: 'center'}}>
          <MonoLabel size={17} color={C.lime} boxed>已綁定・事先同意</MonoLabel>
        </div>
      </div>
    </AbsoluteFill>
  );
};
