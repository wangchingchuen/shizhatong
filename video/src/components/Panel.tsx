import React from 'react';
import {C, FONT} from '../theme';
import {useLayout} from '../layout';

/** Thin-bordered instrument panel with a mono header. */
export const Panel: React.FC<{title: string; right?: React.ReactNode; children: React.ReactNode; style?: React.CSSProperties}> = ({title, right, children, style}) => {
  const {u} = useLayout();
  return (
    <div style={{position: 'relative', border: `1px solid ${C.lineStrong}`, borderRadius: 10 * u, background: 'rgba(13,33,27,0.72)', padding: 24 * u, display: 'flex', flexDirection: 'column', ...style}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 * u, fontFamily: FONT.mono, fontSize: 17 * u, letterSpacing: '0.1em', color: C.limeDim}}>
        <span><span style={{display: 'inline-block', width: 7 * u, height: 7 * u, background: C.lime, marginRight: 10 * u, verticalAlign: 'middle'}} />{title}</span>
        <span>{right}</span>
      </div>
      <div style={{flex: 1, position: 'relative'}}>{children}</div>
    </div>
  );
};
