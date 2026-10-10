import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {ramp, spr} from '../anim';
import {C, FONT} from '../theme';
import {useLayout} from '../layout';
import {GridBg} from '../components/GridBg';
import {Phone} from '../components/Phone';
import {Cursor} from '../components/Cursor';
import {MonoLabel} from '../components/MonoLabel';

// Real screenshots of dist/ captured by scripts/capture-demo.mjs (sizes in px @2x)
const SHOT = {
  off: {src: 'shots/00-consent-off.png', w: 856, h: 196},
  on: {src: 'shots/01-consent.png', w: 856, h: 196},
  guard: {src: 'shots/02-guarding.png', w: 780, h: 384},
  risk: {src: 'shots/03-risk.png', w: 896, h: 1146},
};
const STEPS = [
  {at: 0.6, label: '勾選本次分析同意'},
  {at: 3.2, label: '按下「啟用守護並開始」'},
  {at: 3.6, label: '守護中'},
  {at: 6.4, label: '風險卡片與理由標籤'},
];

/** 句7–8 — camera pulls out to a 3D-tilted phone showing the real prototype UI, step by step. */
export const Demo: React.FC = () => {
  const frame = useCurrentFrame();
  const {W, H, V, u} = useLayout();
  const t = frame / 30;
  const pull = spr(frame, 0, {damping: 26, stiffness: 50});
  const pw = (V ? 460 : 410) * u;
  const s = pw * 0.93; // screen width
  const rotY = -22 + ramp(frame, [0, 360], [0, 12]);
  const rotX = 9 - ramp(frame, [0, 360], [0, 4]);
  const scrollTo = ramp(frame, [6.2 * 30, 7.0 * 30]);
  const consentOn = t >= 1.6;
  const pressed = t >= 3.2 && t < 3.45;
  const step = STEPS.reduce((a, st, i) => (t >= st.at ? i : a), -1);
  const iw = s * 0.94; // image width in screen
  const hConsent = iw * SHOT.on.h / SHOT.on.w;
  const hGuard = iw * SHOT.guard.h / SHOT.guard.w;
  const hRisk = iw * SHOT.risk.h / SHOT.risk.w;
  const guardIn = spr(frame, 3.5, {damping: 16});
  // cursor path (screen-local)
  const top0 = s * 0.28;
  const cbox = {x: iw * (40 / 856), y: top0 + hGuard + 30 * u + hConsent * (44 / 196)};
  const bstart = {x: iw * (160 / 856), y: top0 + hGuard + 30 * u + hConsent * (128 / 196)};
  const cur = t < 2.2 ? {x: s * 0.6 + (cbox.x - s * 0.6) * ramp(frame, [0.4 * 30, 1.5 * 30]), y: s * 1.6 + (cbox.y - s * 1.6) * ramp(frame, [0.4 * 30, 1.5 * 30])}
    : {x: cbox.x + (bstart.x - cbox.x) * ramp(frame, [2.2 * 30, 3.0 * 30]), y: cbox.y + (bstart.y - cbox.y) * ramp(frame, [2.2 * 30, 3.0 * 30])};
  const click = t >= 3.2 ? t - 3.2 : t >= 1.6 ? t - 1.6 : -1;
  const reasonsLock = (k: number) => spr(frame, 8.6 + k * 0.4, {damping: 12, stiffness: 220});
  return (
    <AbsoluteFill>
      <GridBg light={{x: V ? 0.5 : 0.62, y: 0.45, r: 0.5}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', perspective: 2000 * u}}>
        <div style={{transform: `${V ? `translateY(${-H * 0.14}px)` : `translate(${W * 0.12}px, ${-H * 0.04}px)`} scale(${2.1 - 1.1 * pull}) rotateY(${rotY * pull}deg) rotateX(${rotX * pull}deg)`, transformStyle: 'preserve-3d'}}>
          <Phone w={pw} screenBg="#f6f6f0" glow={0.5}>
            <div style={{position: 'absolute', left: (s - iw) / 2, right: (s - iw) / 2, top: 0, transform: `translateY(${-scrollTo * (hGuard + hConsent + 30 * u)}px)`}}>
              <div style={{height: top0, display: 'flex', alignItems: 'flex-end', paddingBottom: 14 * u, fontFamily: FONT.tc, fontWeight: 700, fontSize: s * 0.06, color: '#1f3b32'}}>識詐通 · 即時守護</div>
              <div style={{position: 'relative'}}>
                <Img src={staticFile(SHOT.guard.src)} style={{width: iw, display: 'block', borderRadius: 12 * u, opacity: t >= 3.5 ? 1 : 0.35, filter: t >= 3.5 ? 'none' : 'grayscale(1)'}} />
                {t >= 3.5 && <div style={{position: 'absolute', left: 8 * u, top: 6 * u, right: 8 * u, height: hGuard * 0.16, border: `${3 * u}px solid ${C.lime}`, borderRadius: 6 * u, opacity: guardIn, boxShadow: `0 0 ${16 * u}px rgba(220,237,165,0.8)`}} />}
              </div>
              <div style={{height: 30 * u}} />
              <Img src={staticFile(consentOn ? SHOT.on.src : SHOT.off.src)} style={{width: iw, display: 'block', filter: pressed ? 'brightness(0.85)' : 'none'}} />
              <div style={{height: 30 * u}} />
              <div style={{position: 'relative'}}>
                <Img src={staticFile(SHOT.risk.src)} style={{width: iw, display: 'block'}} />
                {/* lock-on frames over the three reason tags in the real screenshot */}
                {[[44, 964, 282, 1026], [296, 964, 534, 1026], [548, 964, 720, 1026]].map(([x0, y0, x1, y1], k) => {
                  const p = reasonsLock(k);
                  if (p < 0.01) return null;
                  const sc = iw / SHOT.risk.w, grow = (1 - p) * 14 * u;
                  return <div key={k} style={{position: 'absolute', left: x0 * sc - 4 * u - grow, top: y0 * sc - 4 * u - grow, width: (x1 - x0) * sc + 8 * u + grow * 2, height: (y1 - y0) * sc + 8 * u + grow * 2,
                    border: `${3 * u}px solid ${C.lime}`, borderRadius: 6 * u, opacity: p, boxShadow: `0 0 ${12 * u}px rgba(220,237,165,0.7)`}} />;
                })}
              </div>
            </div>
            {t < 3.6 && <Cursor x={(s - iw) / 2 + cur.x} y={cur.y} size={34 * u} click={click} />}
          </Phone>
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: V ? W * 0.08 : W * 0.08, top: V ? H * 0.62 : H * 0.3, display: 'flex', flexDirection: 'column', gap: (V ? 10 : 22) * u, opacity: ramp(frame, [10, 25])}}>
        <MonoLabel size={18} color={C.limeDim}>PROTOTYPE · dist/ 實際截圖</MonoLabel>
        {STEPS.map((st, i) => (
          <div key={i} style={{display: 'flex', gap: 18 * u, alignItems: 'center', opacity: i <= step ? 1 : 0.3}}>
            <span style={{fontFamily: FONT.mono, fontSize: 20 * u, color: i === step ? C.bg : C.lime, background: i === step ? C.lime : 'transparent', border: `1px solid ${C.lime}`, padding: `${2 * u}px ${8 * u}px`, borderRadius: 4 * u}}>{String(i + 1).padStart(2, '0')}</span>
            <span style={{fontFamily: FONT.tc, fontSize: (V ? 30 : 34) * u, color: C.text, fontWeight: i === step ? 700 : 400}}>{st.label}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
