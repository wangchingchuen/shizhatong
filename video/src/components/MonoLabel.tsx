import React from 'react';
import {C, FONT} from '../theme';
import {useLayout} from '../layout';

/** Small monospace data label, e.g. "ON-DEVICE ASR". */
export const MonoLabel: React.FC<{children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties; boxed?: boolean}> = ({children, color = C.lime, size = 20, style, boxed}) => {
  const {u} = useLayout();
  return (
    <div style={{fontFamily: FONT.mono, fontSize: size * u, letterSpacing: '0.08em', color, whiteSpace: 'nowrap',
      ...(boxed ? {border: `1px solid ${color}`, padding: `${4 * u}px ${10 * u}px`, borderRadius: 4 * u} : {}), ...style}}>
      {children}
    </div>
  );
};
