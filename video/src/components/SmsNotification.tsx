import React from 'react';
import {C, FONT} from '../theme';

/** Lock-screen SMS notification banner. s = width. `chars` limits typed characters (undefined = full). */
export const SmsNotification: React.FC<{s: number; text: string; chars?: number; time?: string; cursor?: boolean}> = ({s, text, chars, time = '現在', cursor}) => {
  const shown = chars === undefined ? text : text.slice(0, chars);
  return (
    <div style={{width: s, borderRadius: s * 0.06, background: 'rgba(30,52,45,0.92)', border: '1px solid rgba(220,237,165,0.35)', padding: s * 0.05,
      boxShadow: `0 ${s * 0.03}px ${s * 0.08}px rgba(0,0,0,0.45), 0 0 ${s * 0.08}px rgba(220,237,165,0.18)`, fontFamily: FONT.tc}}>
      <div style={{display: 'flex', alignItems: 'center', gap: s * 0.03, marginBottom: s * 0.03}}>
        <div style={{width: s * 0.075, height: s * 0.075, borderRadius: s * 0.02, background: C.lime, color: C.bg, fontWeight: 900, fontSize: s * 0.05, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>訊</div>
        <div style={{fontSize: s * 0.042, color: C.textDim, flex: 1}}>簡訊 · 識詐通</div>
        <div style={{fontFamily: FONT.mono, fontSize: s * 0.038, color: C.textDim}}>{time}</div>
      </div>
      <div style={{fontSize: s * 0.055, color: C.text, lineHeight: 1.5}}>
        {shown}
        {cursor && <span style={{display: 'inline-block', width: s * 0.025, height: s * 0.055, background: C.lime, marginLeft: 3, verticalAlign: '-0.1em'}} />}
      </div>
    </div>
  );
};
