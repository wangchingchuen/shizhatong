import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ramp, spr} from '../anim';
import {C, FONT} from '../theme';
import {useLayout} from '../layout';
import {GridBg} from '../components/GridBg';
import {Logo, PulseRing} from '../components/Logo';

const TITLE = '有「識」無恐，詐騙不通';
const SHI = 2;
const BANDS = 14;

/** 片名卡 — built by scan lines row by row; 識 lights, enlarges, shrinks into the logo; lime pulse. */
export const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const {V, u, H} = useLayout();
  const t = frame / 30;
  const fs = (V ? 88 : 140) * u;
  const chars = [...TITLE];
  const n = chars.length;
  const build = ramp(frame, [3, 2.2 * 30], [0, 1], (x) => x);
  const shiOn = spr(frame, 2.4, {damping: 11, stiffness: 160});
  const others = 1 - ramp(frame, [2.5 * 30, 3.1 * 30]);
  const toLogo = ramp(frame, [3.4 * 30, 4.2 * 30]);
  const logoIn = spr(frame, 3.9, {damping: 14, stiffness: 150});
  const shiX = (SHI - (n - 1) / 2) * fs * (1 - ramp(frame, [2.5 * 30, 3.3 * 30]));
  const shiScale = (1 + shiOn * 0.9) * (1 - toLogo * 0.45);
  const nameIn = spr(frame, 4.5, {damping: 18});
  const logoSize = (V ? 230 : 210) * u;
  return (
    <AbsoluteFill>
      <GridBg light={{x: 0.5, y: 0.45, r: 0.5, a: shiOn * 0.8}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        {/* title rows built from scan bands */}
        <div style={{position: 'relative', height: fs * 1.3, width: fs * n}}>
          {Array.from({length: BANDS}, (_, b) => {
            const appear = build * BANDS - b;
            if (appear <= 0) return null;
            const jitter = appear < 1 ? (1 - appear) * 40 * u * (b % 2 ? 1 : -1) : 0;
            return (
              <div key={b} style={{position: 'absolute', inset: 0, display: 'flex', clipPath: `inset(${(b / BANDS) * 100}% 0 ${100 - ((b + 1) / BANDS) * 100}% 0)`, transform: `translateX(${jitter}px)`, opacity: Math.min(1, appear)}}>
                {chars.map((c, i) => i === SHI ? <span key={i} style={{width: fs}} /> : (
                  <span key={i} style={{width: fs, textAlign: 'center', fontFamily: FONT.tc, fontWeight: 900, fontSize: fs, lineHeight: `${fs * 1.3}px`, color: C.text, opacity: others}}>{c}</span>
                ))}
              </div>
            );
          })}
          {/* 識 — last to light up */}
          {build > SHI / n && (
            <div style={{position: 'absolute', left: '50%', top: 0, width: fs, marginLeft: -fs / 2, textAlign: 'center', transform: `translateX(${shiX}px) translateY(${toLogo * -0.02 * H}px) scale(${shiScale})`,
              fontFamily: FONT.tc, fontWeight: 900, fontSize: fs, lineHeight: `${fs * 1.3}px`, color: shiOn > 0.05 ? C.lime : 'rgba(244,246,242,0.25)',
              textShadow: shiOn > 0.05 ? `0 0 ${30 * u * shiOn}px rgba(220,237,165,0.55)` : 'none', opacity: 1 - ramp(frame, [4.05 * 30, 4.2 * 30])}}>識</div>
          )}
          {/* logo box closes around it */}
          {t > 3.8 && (
            <div style={{position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, transform: `translateY(${-0.02 * H}px)`}}>
              <div style={{position: 'absolute', left: -logoSize / 2, top: -logoSize / 2, width: logoSize, height: logoSize}}>
                <PulseRing size={logoSize} t={t - 4.2} rings={2} />
                <div style={{transform: `scale(${0.6 + 0.4 * logoIn})`, opacity: Math.min(1, logoIn * 1.5)}}><Logo size={logoSize} glow={0.8} /></div>
              </div>
            </div>
          )}
        </div>
        {/* scan line */}
        {build > 0 && build < 1 && <div style={{position: 'absolute', left: 0, right: 0, top: `calc(50% - ${fs * 0.65}px + ${build * fs * 1.3}px)`, height: 2, background: C.lime, boxShadow: `0 0 16px ${C.lime}`}} />}
        <div style={{position: 'absolute', top: `calc(50% + ${logoSize * 0.72}px)`, textAlign: 'center', opacity: nameIn, transform: `translateY(${(1 - nameIn) * 16 * u}px)`}}>
          <div style={{fontFamily: FONT.tc, fontWeight: 900, fontSize: 56 * u, color: C.text, letterSpacing: '0.2em'}}>識詐通</div>
          <div style={{fontFamily: FONT.tc, fontSize: 26 * u, color: C.textDim, marginTop: 8 * u, letterSpacing: '0.12em'}}>即時反詐騙通話輔助系統</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
