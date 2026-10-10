import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ramp, spr} from '../anim';
import {C, FONT} from '../theme';
import {useLayout} from '../layout';
import {GridBg} from '../components/GridBg';
import {Scanner} from '../components/Scanner';
import {MonoLabel} from '../components/MonoLabel';
import {RollingNumber} from '../components/RollingNumber';

// Sentences from dist/engine.js scenarios: ordinary lines pass L1; the scam line is caught.
const STREAM = [
  {text: '媽，我今天六點回家，一起吃晚餐。', hit: false},
  {text: '我已經買好水果了，你不用出門。', hit: false},
  {text: '記得休息，等等見。', hit: false},
  {text: '請立刻到提款機，轉帳到監管帳戶。', hit: true},
  {text: '有疑慮請自行查證官方聯絡方式。', hit: false},
];
const CATCH = 2.7;

/** 句11 — text streams through the L1 raster; most passes, the suspicious fragment is stopped and lit; L2 powers up (+1). */
export const Scan: React.FC = () => {
  const frame = useCurrentFrame();
  const {W, H, V, u} = useLayout();
  const t = frame / 30;
  const scanX = V ? W * 0.5 : W * 0.42;
  const rowH = (V ? 96 : 86) * u;
  const l2 = ramp(frame, [3.6 * 30, 4.0 * 30]);
  const count = t >= 3.6 ? 1 : 0;
  const top0 = V ? H * 0.18 : H * 0.2;
  return (
    <AbsoluteFill>
      <GridBg light={{x: scanX / W, y: 0.45, r: 0.3}} />
      <div style={{position: 'absolute', left: scanX - 60 * u, top: top0 - 40 * u}}>
        <Scanner w={120 * u} h={rowH * STREAM.length + 60 * u} t={t} hot={t >= CATCH ? 1 : 0} />
      </div>
      {STREAM.map((s, i) => {
        // each sentence slides right→left; the hit stops at the scanner
        const speed = (V ? 520 : 760) * u;
        const startX = W + i * 120 * u;
        let x = startX - (t - 0.2 - i * 0.18) * speed;
        const stopX = scanX - 30 * u;
        const caught = s.hit && x <= stopX;
        if (s.hit) x = Math.max(stopX, x);
        const passed = !s.hit && x < scanX;
        const y = top0 + i * rowH;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, whiteSpace: 'nowrap', fontFamily: FONT.tc, fontSize: (V ? 34 : 36) * u, fontWeight: 500,
            color: caught ? C.lime : passed ? 'rgba(244,246,242,0.32)' : C.text,
            border: caught ? `2px solid ${C.lime}` : '2px solid transparent', padding: `${4 * u}px ${14 * u}px`, borderRadius: 6 * u,
            background: caught ? 'rgba(220,237,165,0.1)' : 'transparent', boxShadow: caught ? `0 0 ${24 * u}px rgba(220,237,165,0.35)` : 'none'}}>
            {s.text}
            <span style={{fontFamily: FONT.mono, fontSize: 14 * u, marginLeft: 14 * u, color: caught ? C.lime : C.textFaint}}>{caught ? 'FLAG → L2' : passed ? 'PASS' : ''}</span>
          </div>
        );
      })}
      {/* L2 module */}
      <div style={{position: 'absolute', left: V ? W * 0.12 : W * 0.06, top: V ? H * 0.62 : H * 0.62, width: (V ? 780 : 640) * u, display: 'flex', alignItems: 'center', gap: 28 * u,
        border: `1px solid ${l2 > 0.5 ? C.lime : C.line}`, borderRadius: 10 * u, padding: 24 * u, background: `rgba(220,237,165,${0.02 + l2 * 0.08})`, boxShadow: `0 0 ${l2 * 40 * u}px rgba(220,237,165,${l2 * 0.25})`}}>
        <div style={{width: 84 * u, height: 84 * u, borderRadius: 10 * u, border: `2px solid ${C.lime}`, opacity: 0.3 + 0.7 * l2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.mono, fontWeight: 600, fontSize: 32 * u, color: C.lime}}>L2</div>
        <div style={{flex: 1, opacity: 0.35 + 0.65 * l2}}>
          <div style={{fontFamily: FONT.tc, fontWeight: 700, fontSize: 32 * u, color: C.text}}>深入分析語意</div>
          <MonoLabel size={15} color={C.textFaint}>{l2 > 0.5 ? 'ACTIVE · 命中訊號才啟動' : 'STANDBY · 節省運算'}</MonoLabel>
        </div>
        <div style={{textAlign: 'right'}}>
          <MonoLabel size={14} color={C.textFaint}>L2 啟動</MonoLabel>
          <RollingNumber value={count === 0 ? 0 : Math.min(1, ramp(frame, [3.6 * 30, 4.0 * 30]))} digits={2} size={52 * u} color={C.lime} />
        </div>
      </div>
      <div style={{position: 'absolute', left: V ? W * 0.12 : W * 0.06, top: V ? H * 0.12 : H * 0.12}}>
        <MonoLabel size={18} color={C.limeDim}>TEXT STREAM → L1 SCAN</MonoLabel>
      </div>
    </AbsoluteFill>
  );
};
