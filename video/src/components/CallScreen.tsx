import React from 'react';
import {C, FONT} from '../theme';

/** Phone call UI drawn at phone-screen scale. s = screen width in px. */
export const CallScreen: React.FC<{s: number; title: string; sub?: string; status: string; timer?: string; incoming?: boolean; slide?: number; guarding?: boolean; children?: React.ReactNode}> = ({s, title, sub, status, timer, incoming, slide = 0, guarding, children}) => (
  <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: s * 0.3,
    background: 'radial-gradient(ellipse 120% 60% at 50% 0%, #1b3a30 0%, #0d211b 60%)'}}>
    <div style={{fontFamily: FONT.mono, fontSize: s * 0.045, letterSpacing: '0.12em', color: C.limeDim}}>{status}</div>
    <div style={{fontFamily: FONT.tc, fontWeight: 700, fontSize: s * 0.105, color: C.text, marginTop: s * 0.05}}>{title}</div>
    {sub && <div style={{fontFamily: FONT.mono, fontSize: s * 0.075, color: C.text, marginTop: s * 0.03, letterSpacing: '0.04em'}}>{sub}</div>}
    {timer && <div style={{fontFamily: FONT.mono, fontSize: s * 0.06, color: C.textDim, marginTop: s * 0.04}}>{timer}</div>}
    {guarding && (
      <div style={{marginTop: s * 0.06, fontFamily: FONT.tc, fontSize: s * 0.048, color: C.lime, border: `1px solid ${C.limeDim}`, borderRadius: s, padding: `${s * 0.012}px ${s * 0.05}px`}}>● 識詐通 守護中</div>
    )}
    {incoming && (
      <div style={{position: 'absolute', bottom: s * 0.32, left: s * 0.1, right: s * 0.1, height: s * 0.19, borderRadius: s, background: 'rgba(244,246,242,0.12)', border: '1px solid rgba(244,246,242,0.2)'}}>
        <div style={{position: 'absolute', left: s * 0.015 + slide * (s * 0.8 - s * 0.19), top: s * 0.015, width: s * 0.16, height: s * 0.16, borderRadius: '50%', background: C.lime, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: s * 0.08, color: C.bg}}>☎</div>
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.tc, fontSize: s * 0.05, color: C.textDim, opacity: 1 - slide, paddingLeft: s * 0.12}}>滑動以接聽</div>
      </div>
    )}
    {children}
  </div>
);
