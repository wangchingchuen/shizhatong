import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {ramp, spr} from '../anim';
import {C, FONT} from '../theme';
import {useLayout} from '../layout';
import {GridBg} from '../components/GridBg';
import {Logo, PulseRing} from '../components/Logo';
import logos from '../data/logos.json';

/** 片尾字卡 — title, tagline, logo, disclaimer; school / competition logos from assets/logos/ if present. */
export const End: React.FC = () => {
  const frame = useCurrentFrame();
  const {W, H, V, u} = useLayout();
  const t = frame / 30;
  const logoIn = spr(frame, 0.9, {damping: 14});
  const reveal = ramp(frame, [0.2 * 30, 1.0 * 30]);
  const sub = spr(frame, 1.8, {damping: 20});
  const small = ramp(frame, [2.6 * 30, 3.2 * 30]);
  const out = ramp(frame, [9.2 * 30, 10 * 30], [1, 0]);
  const ls = (V ? 170 : 150) * u;
  return (
    <AbsoluteFill style={{opacity: out}}>
      <GridBg light={{x: 0.5, y: 0.4, r: 0.5}} drift={0.15} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 40 * u, padding: `0 ${W * 0.07}px`, paddingBottom: H * 0.08}}>
        <div style={{position: 'relative', width: ls, height: ls}}>
          <PulseRing size={ls} t={t - 1.4} rings={2} />
          <div style={{transform: `scale(${0.7 + 0.3 * logoIn})`, opacity: logoIn}}><Logo size={ls} glow={0.7} /></div>
        </div>
        <div style={{position: 'relative', fontFamily: FONT.tc, fontWeight: 900, fontSize: (V ? 84 : 120) * u, color: C.text, letterSpacing: '0.04em', textAlign: 'center', lineHeight: 1.25,
          clipPath: `inset(0 ${100 - reveal * 100}% 0 0)`}}>
          有「<span style={{color: C.lime}}>識</span>」無恐，{V ? <br /> : null}詐騙不通
          {reveal < 1 && <div style={{position: 'absolute', top: 0, bottom: 0, left: `${reveal * 100}%`, width: 3, background: C.lime, boxShadow: `0 0 16px ${C.lime}`}} />}
        </div>
        <div style={{fontFamily: FONT.tc, fontWeight: 500, fontSize: (V ? 36 : 40) * u, color: C.text, opacity: sub, transform: `translateY(${(1 - sub) * 14 * u}px)`, textAlign: 'center', lineHeight: 1.5}}>
          識詐通——不讓你在最脆弱的那 10 分鐘{V ? <br /> : null}孤單。
        </div>
        {logos.length > 0 && (
          <div style={{display: 'flex', gap: 48 * u, alignItems: 'center', opacity: small, marginTop: 10 * u}}>
            {logos.map((l: string) => <Img key={l} src={staticFile(l)} style={{height: 80 * u, objectFit: 'contain'}} />)}
          </div>
        )}
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: H * (V ? 0.1 : 0.07), textAlign: 'center', fontFamily: FONT.tc, fontSize: (V ? 22 : 22) * u, color: C.textDim, opacity: small, padding: `0 ${W * 0.06}px`, lineHeight: 1.6}}>
        概念展示｜原型以文字模擬通話，{V ? <br /> : null}尚未連接真實電話與語音模型
      </div>
    </AbsoluteFill>
  );
};
