import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {spr, typedCount} from '../anim';
import {C, FONT} from '../theme';
import {useLayout} from '../layout';
import {GridBg} from '../components/GridBg';
import {SmsNotification} from '../components/SmsNotification';
import {FieldList} from '../components/FieldList';
import {MonoLabel} from '../components/MonoLabel';
import {CLOCK, SMS_TEXT, SMS_TYPE} from '../timeline';

/** 句16 — the SMS enlarged and typed out; data fields: category & time included, transcript/recording/account/OTP masked & struck. */
export const Sms: React.FC = () => {
  const frame = useCurrentFrame();
  const {W, H, V, u} = useLayout();
  const zoom = spr(frame, 0, {damping: 20, stiffness: 90});
  const n = typedCount(frame, SMS_TYPE.start, SMS_TYPE.charSec, [...SMS_TEXT].length);
  const fields = [
    {key: 'CATEGORY', label: '警示類別', value: '可疑的轉帳要求', at: 5.0},
    {key: 'TIME', label: '時間', value: CLOCK, at: 5.35},
    {key: 'TRANSCRIPT', label: '逐字稿', at: 5.75},
    {key: 'AUDIO', label: '錄音', at: 6.05},
    {key: 'ACCOUNT', label: '帳號', at: 6.35},
    {key: 'OTP', label: '驗證碼', at: 6.65},
  ];
  const smsW = (V ? 880 : 760) * u;
  return (
    <AbsoluteFill>
      <GridBg light={{x: V ? 0.5 : 0.3, y: V ? 0.25 : 0.45, r: 0.45}} />
      <AbsoluteFill style={{flexDirection: V ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: (V ? 50 : 80) * u, paddingBottom: V ? H * 0.16 : H * 0.06}}>
        <div style={{transform: `scale(${0.6 + 0.4 * zoom})`, opacity: zoom, display: 'flex', flexDirection: 'column', gap: 16 * u}}>
          <MonoLabel size={18} color={C.limeDim}>SMS · 給事先綁定的家人</MonoLabel>
          <SmsNotification s={smsW} text={SMS_TEXT} chars={n} cursor={n < [...SMS_TEXT].length || Math.floor(frame / 8) % 2 === 0} time={CLOCK.slice(0, 5)} />
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 16 * u}}>
          <MonoLabel size={18} color={C.limeDim}>PAYLOAD · 簡訊資料組成</MonoLabel>
          <FieldList w={(V ? 880 : 640) * u} fields={fields} u={u} />
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', right: W * (V ? 0.06 : 0.045), bottom: H * (V ? 0.1 : 0.05), fontFamily: FONT.tc, fontSize: 18 * u, color: C.textFaint}}>示意畫面</div>
    </AbsoluteFill>
  );
};
