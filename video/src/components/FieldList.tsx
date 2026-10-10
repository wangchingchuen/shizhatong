import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ramp, spr} from '../anim';
import {C, FONT} from '../theme';

export interface Field {key: string; label: string; value?: string; at: number}

/** Data composition of a message: fields with a value, or masked & struck through. */
export const FieldList: React.FC<{w: number; fields: Field[]; u: number}> = ({w, fields, u}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{width: w, display: 'flex', flexDirection: 'column', gap: 14 * u}}>
      {fields.map(f => {
        const p = spr(frame, f.at, {damping: 15, stiffness: 180});
        const strike = ramp(frame, [f.at * 30, f.at * 30 + 8]);
        const has = f.value !== undefined;
        return (
          <div key={f.key} style={{display: 'flex', alignItems: 'center', gap: 18 * u, height: 58 * u, padding: `0 ${18 * u}px`, borderRadius: 8 * u,
            border: `1px solid ${has && p > 0.5 ? C.limeDim : C.line}`, background: has && p > 0.5 ? 'rgba(220,237,165,0.07)' : 'rgba(255,255,255,0.02)'}}>
            <span style={{fontFamily: FONT.mono, fontSize: 14 * u, color: C.textFaint, width: 110 * u, letterSpacing: '0.06em'}}>{f.key}</span>
            <span style={{fontFamily: FONT.tc, fontSize: 25 * u, color: has ? C.text : C.textDim, width: 120 * u}}>{f.label}</span>
            <span style={{flex: 1, position: 'relative', fontFamily: has ? FONT.tc : FONT.mono, fontSize: 22 * u, color: has ? C.lime : C.textFaint}}>
              {has ? <span style={{opacity: p}}>{f.value}</span> : (
                <>
                  <span style={{letterSpacing: '0.1em', opacity: 0.6}}>████████</span>
                  <span style={{position: 'absolute', left: 0, top: '50%', height: 2 * u, width: `${strike * 100}%`, maxWidth: 150 * u, background: C.text}} />
                </>
              )}
            </span>
            <span style={{fontFamily: FONT.mono, fontSize: 14 * u, color: has ? C.lime : C.textFaint, opacity: Math.min(1, p * 1.5)}}>{has ? 'INCLUDED' : 'NOT SENT'}</span>
          </div>
        );
      })}
    </div>
  );
};
