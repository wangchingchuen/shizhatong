import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ramp, spr} from '../anim';
import {C, FONT} from '../theme';
import {useLayout} from '../layout';
import {Phone} from '../components/Phone';
import {CallScreen} from '../components/CallScreen';
import {Silhouette} from '../components/Silhouette';
import {MonoLabel} from '../components/MonoLabel';
import {buzz} from './Open1';

/** One lit window of the facade, seen from outside: frame, mullions, silhouette, phone. */
const WindowPane: React.FC<{w: number; h: number; children: React.ReactNode; label: string; u: number}> = ({w, h, children, label, u}) => (
  <div style={{position: 'relative', width: w, height: h, borderRadius: 6 * u, overflow: 'hidden', border: `${6 * u}px solid #1c3029`,
    background: 'radial-gradient(ellipse 70% 70% at 50% 60%, #1d3a30 0%, #0a1813 75%)', boxShadow: `0 0 ${60 * u}px rgba(0,0,0,0.6)`}}>
    {children}
    <div style={{position: 'absolute', left: '50%', top: 0, bottom: 0, width: 4 * u, marginLeft: -2 * u, background: 'rgba(28,48,41,0.6)'}} />
    <div style={{position: 'absolute', top: '38%', left: 0, right: 0, height: 4 * u, background: 'rgba(28,48,41,0.6)'}} />
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(255,255,255,0.05), transparent 40%)'}} />
    <div style={{position: 'absolute', left: 16 * u, top: 14 * u}}><MonoLabel size={16} color={C.limeDim}>{label}</MonoLabel></div>
  </div>
);

/** 句19 — the daughter calls; grandma hangs up the scam call; her screen switches to 「女兒 來電」 and she answers. */
export const Daughter: React.FC = () => {
  const frame = useCurrentFrame();
  const {W, H, V, u} = useLayout();
  const t = frame / 30;
  const paneW = V ? W * 0.86 : W * 0.42, paneH = V ? H * 0.33 : H * 0.66;
  const pw = (V ? 230 : 250) * u, s = pw * 0.93;
  const ringShake = buzz(t, [[3.2, 0.5], [3.9, 0.5]]) * 4 * u;
  const slide = ramp(frame, [4.3 * 30, 4.95 * 30]);
  const connected = t >= 5.0;
  const sec2 = (a: number) => `00:${String(Math.max(0, Math.floor(t - a))).padStart(2, '0')}`;
  const dScreen = connected
    ? <CallScreen s={s} status="ON CALL" title="媽媽" timer={sec2(5.0)} />
    : <CallScreen s={s} status="CALLING" title="媽媽" timer={t >= 0.6 ? '撥號中' + '.'.repeat(1 + (Math.floor(t * 3) % 3)) : '準備撥號'} />;
  const gScreen = t < 2.6
    ? <CallScreen s={s} status="ON CALL" title="未知來電" sub="02-5550-0188" timer={`08:4${Math.floor(t)}`} guarding />
    : t < 3.2 ? <CallScreen s={s} status="CALL ENDED" title="通話已結束" />
    : connected ? <CallScreen s={s} status="ON CALL" title="女兒" timer={sec2(5.0)} />
    : <CallScreen s={s} status="INCOMING CALL" title="女兒 來電" incoming slide={slide} />;
  const link = ramp(frame, [5.0 * 30, 5.6 * 30]);
  const inA = spr(frame, 0, {damping: 22}), inB = spr(frame, 0.15, {damping: 22});
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <AbsoluteFill style={{background: 'repeating-linear-gradient(90deg, rgba(220,237,165,0.03) 0 1px, transparent 1px 64px), repeating-linear-gradient(0deg, rgba(220,237,165,0.03) 0 1px, transparent 1px 64px)'}} />
      <AbsoluteFill style={{flexDirection: V ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: (V ? 40 : 60) * u, paddingBottom: V ? H * 0.12 : H * 0.04}}>
        <div style={{transform: `translateY(${(1 - inA) * 40 * u}px)`, opacity: inA}}>
          <WindowPane w={paneW} h={paneH} label="21:09 · 女兒家" u={u}>
            <div style={{position: 'absolute', left: '8%', bottom: -paneH * 0.05, filter: `blur(${3 * u}px)`}}><Silhouette h={paneH * 0.95} who="daughter" rim="right" /></div>
            <div style={{position: 'absolute', right: V ? '14%' : '16%', top: '50%', transform: 'translateY(-50%)'}}><Phone w={pw} glow={0.8}>{dScreen}</Phone></div>
          </WindowPane>
        </div>
        <div style={{transform: `translateY(${(1 - inB) * 40 * u}px)`, opacity: inB}}>
          <WindowPane w={paneW} h={paneH} label="21:09 · 阿嬤家" u={u}>
            <div style={{position: 'absolute', right: '6%', bottom: -paneH * 0.05, filter: `blur(${3 * u}px)`}}><Silhouette h={paneH * 0.95} who="grandma" rim="left" /></div>
            <div style={{position: 'absolute', left: V ? '14%' : '16%', top: '50%', transform: 'translateY(-50%)'}}><Phone w={pw} glow={0.8} shake={ringShake}>{gScreen}</Phone></div>
          </WindowPane>
        </div>
      </AbsoluteFill>
      {link > 0 && (
        <div style={{position: 'absolute', left: '50%', top: V ? '44%' : '47%', width: (V ? 6 : 120) * u, height: (V ? 60 : 6) * u, transform: 'translate(-50%,-50%)',
          background: C.lime, opacity: link, boxShadow: `0 0 ${20 * u}px ${C.lime}`, borderRadius: 3 * u}} />
      )}
    </AbsoluteFill>
  );
};
