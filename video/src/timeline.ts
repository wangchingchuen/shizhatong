// Single source of truth for timing. Imported by the Remotion scenes AND by
// scripts/synth-audio.mjs (via Node type stripping), so keep this file free of imports.
export const FPS = 30;
export const OVERLAP = 12; // frames of a scan-wipe transition

export type SceneId =
  | 'open1' | 'open2' | 'title' | 'dialog' | 'alert' | 'demo' | 'buffer' | 'asr' | 'scan'
  | 'contrast' | 'channels' | 'ack' | 'signal' | 'sms' | 'clear' | 'fed' | 'daughter' | 'dawn' | 'end';

export type Sfx =
  | 'vibrate' | 'slide' | 'scan' | 'impact' | 'pulse' | 'type' | 'lock' | 'lockWarn' | 'alert'
  | 'click' | 'tick' | 'powerup' | 'blip' | 'whoosh' | 'receive' | 'sweepDown' | 'dial' | 'hangup'
  | 'ring' | 'pad' | 'zero';

type Cue = [sec: number, sfx: Sfx, opts?: {dur?: number; gain?: number; pan?: number}];
type Line = [startSec: number, endSec: number, text: string];

export interface SceneDef {
  id: SceneId;
  dur: number; // seconds
  enter: 'cut' | 'scan';
  narration: Line[];
  cues: Cue[];
}

// Dialogue beats inside the 'dialog' scene.
export const DIALOG = {
  beat: 7.3,
  typeStart: 1.0, // sec after beat start
  charSec: 0.085,
  lines: [
    {time: '0:00', text: '這裡是地檢署，您涉及一起洗錢案。', lock: ['地檢署', '洗錢案']},
    {time: '3:00', text: '偵查不公開，不要告訴家人。', lock: ['偵查不公開', '不要告訴家人']},
    {time: '8:00', text: '請立刻到提款機，轉帳到監管帳戶。', lock: ['立刻', '提款機', '監管帳戶']},
  ],
};
export const typeEnd = (i: number) =>
  i * DIALOG.beat + DIALOG.typeStart + DIALOG.lines[i].text.length * DIALOG.charSec;

export const SMS_TEXT = '【識詐通】媽媽的通話出現可疑的轉帳要求，請盡快聯絡她協助查證。';
export const SMS_TYPE = {start: 0.9, charSec: 0.075};
export const CLOCK = '21:08:12';

const dialogCues: Cue[] = [];
DIALOG.lines.forEach((l, i) => {
  const b = i * DIALOG.beat;
  for (let c = 0; c < l.text.length; c += 2) dialogCues.push([b + DIALOG.typeStart + c * DIALOG.charSec, 'type', {gain: 0.5}]);
  l.lock.forEach((_, k) => dialogCues.push([typeEnd(i) + 0.15 + k * 0.22, i === 2 ? 'lockWarn' : 'lock']));
});
const smsCues: Cue[] = [];
for (let c = 0; c < SMS_TEXT.length; c += 2) smsCues.push([SMS_TYPE.start + c * SMS_TYPE.charSec, 'type', {gain: 0.45}]);

export const SCENES: SceneDef[] = [
  {id: 'open1', dur: 6, enter: 'cut', narration: [[1.0, 5.7, '晚上九點，阿嬤家的電話響了。']],
    cues: [[3.55, 'scan', {gain: 0.5}], [4.0, 'vibrate', {dur: 0.55}], [4.85, 'vibrate', {dur: 0.55}], [5.7, 'vibrate', {dur: 0.3}]]},
  {id: 'open2', dur: 5, enter: 'cut', narration: [[0.4, 4.7, '螢幕上，是一個沒看過的號碼。']],
    cues: [[0, 'impact', {gain: 0.6}], [0.3, 'vibrate', {dur: 0.55}], [1.15, 'vibrate', {dur: 0.55}], [0.5, 'lock', {gain: 0.6}], [2.6, 'slide'], [3.4, 'click']]},
  {id: 'title', dur: 6, enter: 'scan', narration: [],
    cues: [[0.1, 'scan', {dur: 2.1}], [2.4, 'impact'], [3.5, 'whoosh', {gain: 0.4}], [4.2, 'pulse']]},
  {id: 'dialog', dur: 22, enter: 'scan', narration: [
    [0.2, 4.9, '對方自稱檢察官，語氣一句比一句急。'],
    [7.5, 12.2, '先要她保密，再說電話不能掛斷。'],
    [14.8, 19.6, '最後，要她把錢轉進「監管帳戶」。']],
    cues: dialogCues},
  {id: 'alert', dur: 6, enter: 'cut', narration: [[0.6, 5.6, '就在這時，手機跳出提醒：先停一下。']],
    cues: [[0, 'alert'], [0.55, 'whoosh', {gain: 0.35}], [1.7, 'lockWarn'], [2.3, 'lockWarn'], [2.9, 'lockWarn']]},
  {id: 'demo', dur: 12, enter: 'scan', narration: [[0.5, 5.6, '識詐通在通話中，幫你看見可疑的話術。'], [6.1, 11.6, '每一通電話，都由使用者自己啟用守護。']],
    cues: [[0.2, 'whoosh', {gain: 0.4}], [1.6, 'click'], [3.2, 'click'], [3.5, 'powerup', {gain: 0.6}], [6.4, 'whoosh', {gain: 0.3}], [8.6, 'lock'], [9.0, 'lock'], [9.4, 'lock']]},
  {id: 'buffer', dur: 6.5, enter: 'scan', narration: [[0.4, 6.1, '聲音只在手機記憶體裡短暫停留，不保存錄音。']],
    cues: Array.from({length: 18}, (_, i) => [0.5 + i * 0.3, i % 4 === 3 ? 'zero' : 'tick', {gain: 0.5}] as Cue)},
  {id: 'asr', dur: 5.5, enter: 'cut', narration: [[0.3, 5.2, '手機在本機把聲音轉成暫時的文字。']],
    cues: [[0.2, 'impact', {gain: 0.4}], [1.6, 'powerup', {gain: 0.5}], ...Array.from({length: 10}, (_, i) => [2.0 + i * 0.28, 'tick', {gain: 0.4}] as Cue)]},
  {id: 'scan', dur: 6.5, enter: 'scan', narration: [[0.3, 6.1, '先輕量初篩，發現可疑才深入分析語意。']],
    cues: [[0.3, 'scan', {dur: 2.4}], [2.7, 'lock'], [3.6, 'powerup']]},
  {id: 'contrast', dur: 6, enter: 'cut', narration: [[0.3, 5.6, '它分得出善意的提醒，和真正的索取。']],
    cues: [[0, 'impact', {gain: 0.4}], [1.6, 'lock'], [3.2, 'lockWarn']]},
  {id: 'channels', dur: 6, enter: 'scan', narration: [[0.3, 5.6, '分散在不同句子的訊號，會被拼在一起看。']],
    cues: [[0.9, 'blip'], [1.8, 'blip', {pan: -0.2}], [2.7, 'blip', {pan: 0.2}], [3.6, 'powerup']]},
  {id: 'ack', dur: 6, enter: 'cut', narration: [[0.3, 5.6, '提醒會說明原因，下一步仍由你決定。']],
    cues: [[0, 'impact', {gain: 0.35}], [2.0, 'click'], [2.9, 'lock', {gain: 0.6}]]},
  {id: 'signal', dur: 7.5, enter: 'scan', narration: [[0.4, 6.9, '同時，即時傳簡訊給事先綁定的家人。']],
    cues: [[0.6, 'alert', {gain: 0.5}], [0.75, 'whoosh', {dur: 1.4}], [2.15, 'receive'], [3.0, 'lock', {gain: 0.5}]]},
  {id: 'sms', dur: 7.5, enter: 'cut', narration: [[0.3, 7.1, '簡訊只寫警示摘要，沒有錄音與逐字稿。']],
    cues: [[0, 'whoosh', {gain: 0.4}], ...smsCues, [5.0, 'lock'], [5.35, 'lock'], [5.75, 'zero'], [6.05, 'zero'], [6.35, 'zero'], [6.65, 'zero']]},
  {id: 'clear', dur: 5.5, enter: 'cut', narration: [[0.3, 5.0, '通話結束，暫存內容立即清除。']],
    cues: [[0.15, 'hangup'], [0.5, 'sweepDown', {dur: 2.2}], [3.0, 'zero']]},
  {id: 'fed', dur: 7, enter: 'scan', narration: [[0.4, 6.6, '未來將研究聯邦學習，參與與否另外同意。']],
    cues: [[0.2, 'whoosh', {gain: 0.3}], ...Array.from({length: 8}, (_, i) => [1.2 + i * 0.22, 'blip', {gain: 0.3, pan: (i % 2 ? 0.4 : -0.4)}] as Cue), [4.1, 'receive', {gain: 0.6}]]},
  {id: 'daughter', dur: 7, enter: 'scan', narration: [[0.4, 6.6, '女兒收到簡訊，立刻打了過來。']],
    cues: [[0.6, 'dial'], [2.6, 'hangup'], [3.2, 'ring', {dur: 1.6}], [5.0, 'click']]},
  {id: 'dawn', dur: 11, enter: 'scan', narration: [[0.8, 4.9, '那一晚，阿嬤沒有轉帳。'], [5.6, 10.5, '號碼可以換，詐騙的意圖藏不住。']],
    cues: [[0, 'pad', {dur: 11}]]},
  {id: 'end', dur: 10, enter: 'scan', narration: [],
    cues: [[0.3, 'impact'], [1.4, 'pulse'], [9.0, 'sweepDown', {dur: 1.0, gain: 0.3}]]},
];

export const sceneStart: Record<SceneId, number> = {} as Record<SceneId, number>;
{
  let t = 0;
  for (const s of SCENES) { sceneStart[s.id] = t; t += s.dur; }
}
export const TOTAL_SEC = SCENES.reduce((a, s) => a + s.dur, 0);
export const TOTAL_FRAMES = Math.round(TOTAL_SEC * FPS);
export const f = (sec: number) => Math.round(sec * FPS);
export const scene = (id: SceneId) => SCENES.find(s => s.id === id)!;
