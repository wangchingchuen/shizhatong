import React from 'react';
import {C, FONT} from '../theme';
import {hash} from '../anim';

/** RAM block of hex bytes; a sweep (progress 0..1, top→bottom) overwrites rows with 00. */
export const MemoryGrid: React.FC<{cols: number; rows: number; cell: number; sweep: number; u: number}> = ({cols, rows, cell, sweep, u}) => {
  const sweepRow = sweep * rows;
  return (
    <div style={{position: 'relative', display: 'grid', gridTemplateColumns: `${70 * u}px repeat(${cols}, ${cell}px)`, rowGap: cell * 0.12, fontFamily: FONT.mono, fontSize: cell * 0.42}}>
      {Array.from({length: rows}, (_, r) => {
        const cleared = r < sweepRow - 0.5;
        return (
          <React.Fragment key={r}>
            <span style={{color: C.textFaint, fontSize: cell * 0.32, alignSelf: 'center'}}>{`0x${(0x4000 + r * cols).toString(16).toUpperCase()}`}</span>
            {Array.from({length: cols}, (_, c) => {
              const v = Math.floor(hash(r * 97 + c) * 256);
              const near = Math.abs(r - sweepRow) < 1.2;
              return <span key={c} style={{height: cell * 0.8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: cleared ? 'rgba(244,246,242,0.28)' : near ? C.bg : C.lime, background: near ? C.lime : cleared ? 'transparent' : 'rgba(220,237,165,0.08)', borderRadius: 2}}>
                {cleared || near ? '00' : v.toString(16).toUpperCase().padStart(2, '0')}
              </span>;
            })}
          </React.Fragment>
        );
      })}
      {sweep > 0 && sweep < 1 && <div style={{position: 'absolute', left: 0, right: 0, top: `${sweep * 100}%`, height: 2, background: C.lime, boxShadow: `0 0 14px ${C.lime}`}} />}
    </div>
  );
};
