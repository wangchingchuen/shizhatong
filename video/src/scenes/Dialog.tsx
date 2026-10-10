import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ramp} from '../anim';
import {C, FONT} from '../theme';
import {useLayout} from '../layout';
import {GridBg} from '../components/GridBg';
import {Panel} from '../components/Panel';
import {Waveform} from '../components/Waveform';
import {LiveTranscript} from '../components/LiveTranscript';
import {RiskChart} from '../components/RiskChart';
import {DIALOG, typeEnd} from '../timeline';
import risk from '../data/risk.json';

const TAGS: Record<string, string> = {authority: '假冒權威', secrecy: '要求保密', money: '要求移轉資金', pressure: '時間壓力'};
// word → engine signal it belongs to (the tag text is the engine's signal, see dist/engine.js rules)
const WORD_SIGNAL: Record<string, string> = {地檢署: 'authority', 洗錢案: 'authority', 偵查不公開: 'secrecy', 不要告訴家人: 'secrecy', 立刻: 'pressure', 提款機: 'money', 監管帳戶: 'money'};

export const heartbeatBpm = (t: number) => 64 + (t / 22) * 58;

/** 句3–5 — three columns: live waveform · live transcript with lock-ons · risk index climbing (from analyze()). */
export const Dialog: React.FC = () => {
  const frame = useCurrentFrame();
  const {W, H, V, u} = useLayout();
  const t = frame / 30;
  const lines = DIALOG.lines.map((l, i) => {
    const seen = new Set<string>();
    return {
      time: l.time, text: l.text, start: i * DIALOG.beat + DIALOG.typeStart, charSec: DIALOG.charSec,
      locks: l.lock.map((w, k) => {
        const sig = WORD_SIGNAL[w];
        const tag = seen.has(sig) ? undefined : TAGS[sig];
        seen.add(sig);
        return {word: w, tag: tag as string, at: typeEnd(i) + 0.15 + k * 0.22};
      }),
    };
  });
  const level = (tt: number) => {
    for (let i = 0; i < 3; i++) {
      const a = i * DIALOG.beat + DIALOG.typeStart, b = typeEnd(i);
      if (tt >= a && tt <= b) return 0.55 + 0.45 * Math.abs(Math.sin(tt * 9.5)) * (0.4 + 0.6 * i / 2 + 0.2);
    }
    return 0.05;
  };
  const points = risk.steps.map((s, i) => ({min: Number(s.time.split(':')[0]), label: s.time, value: s.score, at: typeEnd(i) + 0.2}));
  // heartbeat: faint vignette pulse, faster each sentence
  const bpm = heartbeatBpm(t);
  const phase = (t * bpm / 60) % 1;
  const beat = Math.exp(-phase * 9) * ramp(frame, [0, 30]);
  const clock = ['0:00', '3:00', '8:00'][Math.min(2, Math.floor(t / DIALOG.beat))];

  const pad = V ? 0.06 * W : 0.045 * W;
  const colGap = 28 * u;
  const waveW = V ? W - pad * 2 - 48 * u : 380 * u;
  const chartW = V ? W - pad * 2 - 48 * u : 440 * u;

  const wave = (
    <Panel title="VOICE · LIVE" right={<span>{clock}</span>} style={V ? {height: H * 0.12} : {width: waveW + 48 * u, height: H * 0.56}}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <Waveform w={waveW} h={(V ? 120 : 300) * u} bars={V ? 60 : 40} level={level} />
      </AbsoluteFill>
    </Panel>
  );
  const transcript = (
    <Panel title="LIVE TRANSCRIPT · 暫存" right="ON-DEVICE" style={V ? {height: H * 0.27} : {flex: 1, height: H * 0.56}}>
      <LiveTranscript lines={lines} size={V ? 38 : 36} />
    </Panel>
  );
  const chart = (
    <Panel title="RISK INDEX" right={<span>analyze()</span>} style={V ? {height: H * 0.22} : {width: chartW + 48 * u, height: H * 0.56}}>
      <RiskChart w={chartW} h={(V ? 120 : 260) * u} numSize={V ? 80 : 110} points={points} threshold={55} u={u} />
    </Panel>
  );
  return (
    <AbsoluteFill>
      <GridBg />
      <AbsoluteFill style={{boxShadow: `inset 0 0 ${220 * u}px rgba(0,0,0,${0.35 + beat * 0.35})`}} />
      <div style={{position: 'absolute', left: pad, right: pad, top: V ? H * 0.09 : H * 0.12, display: 'flex', flexDirection: V ? 'column' : 'row', gap: colGap}}>
        {wave}{transcript}{chart}
      </div>
      <div style={{position: 'absolute', left: pad, top: V ? H * 0.065 : H * 0.085, fontFamily: FONT.mono, fontSize: 16 * u, color: C.textFaint, letterSpacing: '0.1em'}}>
        CALL 02-5550-0188 · SIMULATED
      </div>
    </AbsoluteFill>
  );
};
