import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ramp, spr} from '../anim';
import {C, FONT} from '../theme';
import {useLayout} from '../layout';
import {GridBg} from '../components/GridBg';
import {Chip} from '../components/Chip';
import {Waveform} from '../components/Waveform';
import {MonoLabel} from '../components/MonoLabel';

const TOKENS = ['請', '立刻', '到', '提款機', '，', '轉帳', '到', '監管', '帳戶', '。'];

/** 句10 — the waveform flows into the on-device chip and comes out as a stream of temporary text tokens. */
export const Asr: React.FC = () => {
  const frame = useCurrentFrame();
  const {W, H, V, u} = useLayout();
  const t = frame / 30;
  const chipOn = ramp(frame, [1.5 * 30, 1.9 * 30]);
  const size = (V ? 360 : 330) * u;
  const inflow = ramp(frame, [0.3 * 30, 1.8 * 30]);
  return (
    <AbsoluteFill>
      <GridBg light={{x: 0.5, y: V ? 0.42 : 0.48, r: 0.4, a: 0.4 + chipOn * 0.6}} />
      <AbsoluteFill style={{flexDirection: V ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: (V ? 70 : 80) * u, paddingBottom: V ? H * 0.14 : H * 0.05}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 * u, clipPath: V ? `inset(0 0 ${100 - inflow * 100}% 0)` : `inset(0 ${100 - inflow * 100}% 0 0)`}}>
          <MonoLabel size={18} color={C.limeDim}>VOICE · IN RAM</MonoLabel>
          <Waveform w={(V ? 560 : 420) * u} h={140 * u} bars={36} level={(tt) => 0.4 + 0.5 * Math.abs(Math.sin(tt * 6))} />
        </div>
        <div style={{position: 'relative'}}>
          <Chip size={size} label="On-device ASR" sub="本機語音轉文字" active={0.3 + chipOn * 0.7} />
          <div style={{position: 'absolute', left: 0, right: 0, top: size + 34 * u, textAlign: 'center'}}>
            <MonoLabel size={16} color={C.textFaint}>分析不上傳通話音訊</MonoLabel>
          </div>
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 12 * u, width: (V ? 700 : 470) * u, justifyContent: V ? 'center' : 'flex-start'}}>
          {TOKENS.map((tok, i) => {
            const at = 2.0 + i * 0.28;
            const p = spr(frame, at, {damping: 13, stiffness: 200});
            if (t < at) return null;
            return (
              <span key={i} style={{fontFamily: FONT.tc, fontWeight: 500, fontSize: 40 * u, color: C.text, border: `1px solid ${C.limeDim}`, borderRadius: 6 * u, padding: `${4 * u}px ${12 * u}px`,
                background: 'rgba(220,237,165,0.06)', opacity: p, transform: `translateX(${(1 - p) * -40 * u}px)`}}>
                {tok}<span style={{fontFamily: FONT.mono, fontSize: 12 * u, color: C.limeDim, marginLeft: 6 * u, verticalAlign: 'super'}}>{String(i).padStart(2, '0')}</span>
              </span>
            );
          })}
          <div style={{width: '100%', marginTop: 10 * u, opacity: ramp(frame, [4.2 * 30, 4.6 * 30])}}>
            <MonoLabel size={16} color={C.limeDim}>TEMPORARY TEXT · 暫時的文字</MonoLabel>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
