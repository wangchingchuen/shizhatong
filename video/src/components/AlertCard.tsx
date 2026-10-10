import React from 'react';
import {useCurrentFrame} from 'remotion';
import {spr} from '../anim';
import {C, FONT} from '../theme';
import {LockBox} from './LockBox';

/** The one brick-orange element in the film: in-call warning card. s = card width. */
export const AlertCard: React.FC<{s: number; tagsAt?: number[]; tags?: string[]; showAck?: boolean; ackPressed?: boolean}> = ({s, tagsAt = [0, 0, 0], tags = ['假冒權威', '要求保密', '要求移轉資金'], showAck, ackPressed}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{width: s, borderRadius: s * 0.06, background: 'linear-gradient(180deg, #3b2219 0%, #1f140f 100%)', border: `${Math.max(1.5, s * 0.006)}px solid ${C.brick}`,
      boxShadow: `0 0 ${s * 0.12}px rgba(193,113,76,0.45), 0 ${s * 0.04}px ${s * 0.1}px rgba(0,0,0,0.5)`, padding: s * 0.06, fontFamily: FONT.tc}}>
      <div style={{display: 'flex', alignItems: 'center', gap: s * 0.03}}>
        <div style={{width: s * 0.085, height: s * 0.085, borderRadius: '50%', background: C.brick, color: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: s * 0.06}}>!</div>
        <div style={{fontFamily: FONT.mono, fontSize: s * 0.035, letterSpacing: '0.1em', color: '#e9b49b'}}>識詐通 · 提醒</div>
      </div>
      <div style={{fontWeight: 900, fontSize: s * 0.085, color: '#fbe6dc', marginTop: s * 0.04, lineHeight: 1.25}}>疑似詐騙話術，<br />先停一下</div>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: `${s * 0.045}px ${s * 0.05}px`, marginTop: s * 0.06, paddingLeft: s * 0.015}}>
        {tags.map((t, i) => {
          const p = spr(frame, tagsAt[i] ?? 0, {damping: 13, stiffness: 200});
          return (
            <span key={t} style={{fontSize: s * 0.05, color: '#fbe6dc', opacity: 0.25 + 0.75 * Math.min(1, p * 2), padding: `${s * 0.01}px ${s * 0.015}px`}}>
              <LockBox at={tagsAt[i] ?? 0} color={C.brick}>{t}</LockBox>
            </span>
          );
        })}
      </div>
      {showAck && (
        <div style={{display: 'flex', gap: s * 0.04, marginTop: s * 0.07}}>
          <div style={{flex: 1, textAlign: 'center', padding: `${s * 0.035}px 0`, borderRadius: s * 0.03, fontSize: s * 0.05, fontWeight: 700,
            background: ackPressed ? '#fbe6dc' : 'rgba(251,230,220,0.12)', color: ackPressed ? C.bg : '#fbe6dc', border: '1px solid rgba(251,230,220,0.5)'}}>我知道了</div>
          <div style={{flex: 1, textAlign: 'center', padding: `${s * 0.035}px 0`, borderRadius: s * 0.03, fontSize: s * 0.05, color: '#e9b49b', border: '1px solid rgba(233,180,155,0.35)'}}>聯絡家人</div>
        </div>
      )}
    </div>
  );
};
