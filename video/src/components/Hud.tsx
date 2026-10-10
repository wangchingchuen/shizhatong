import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {useLayout} from '../layout';
import {FPS, SCENES, sceneStart} from '../timeline';

/** Corner data labels, like a keynote HUD. Hidden on title / end cards. */
export const Hud: React.FC = () => {
  const frame = useCurrentFrame();
  const {u, V, W, H} = useLayout();
  const t = frame / FPS;
  const idx = SCENES.findIndex((s, i) => t >= sceneStart[s.id] && (i === SCENES.length - 1 || t < sceneStart[SCENES[i + 1].id]));
  const id = SCENES[idx]?.id;
  if (id === 'title' || id === 'end') return null;
  const m = V ? 0.06 : 0.045;
  const style: React.CSSProperties = {position: 'absolute', fontFamily: FONT.mono, fontSize: 16 * u, letterSpacing: '0.14em', color: C.textFaint};
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{...style, left: W * m, top: H * (V ? 0.045 : 0.05)}}>識詐通 · SHIZHATONG</div>
      <div style={{...style, right: W * m, top: H * (V ? 0.045 : 0.05)}}>{String(idx + 1).padStart(2, '0')} / {SCENES.length} · CONCEPT</div>
    </AbsoluteFill>
  );
};
