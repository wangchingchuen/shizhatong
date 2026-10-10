import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {C} from './theme';
import {f, OVERLAP, SCENES, SceneId, sceneStart} from './timeline';
import {ScanWipe} from './components/ScanWipe';
import {Subtitles} from './components/Subtitles';
import {Hud} from './components/Hud';
import * as S from './scenes';

const MAP: Record<SceneId, React.FC> = {
  open1: S.Open1, open2: S.Open2, title: S.Title, dialog: S.Dialog, alert: S.Alert, demo: S.Demo, buffer: S.Buffer, asr: S.Asr, scan: S.Scan,
  contrast: S.Contrast, channels: S.Channels, ack: S.Ack, signal: S.Signal, sms: S.Sms, clear: S.Clear, fed: S.Fed, daughter: S.Daughter, dawn: S.Dawn, end: S.End,
};

export const Video: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    {SCENES.map((s, i) => {
      const next = SCENES[i + 1];
      const extra = next?.enter === 'scan' ? OVERLAP : 0;
      const Comp = MAP[s.id];
      return (
        <Sequence key={s.id} name={s.id} from={f(sceneStart[s.id])} durationInFrames={f(s.dur) + extra}>
          <ScanWipe enabled={i > 0 && s.enter === 'scan'}><Comp /></ScanWipe>
        </Sequence>
      );
    })}
    <Hud />
    <Subtitles />
  </AbsoluteFill>
);
