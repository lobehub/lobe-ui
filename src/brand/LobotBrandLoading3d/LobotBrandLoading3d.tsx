'use client';

import clsx from 'clsx';
import { type FC, useId, useMemo } from 'react';

import { buildStillScene } from '@/AgentAvatar/still';
import { useReducedMotion } from '@/AgentAvatar/useReducedMotion';
import { styleProps } from '@/styles/stylex/props';
import { useThemeMode } from '@/styles/theme/scope';
import { toDataAttributes } from '@/utils/bem';

import { brandLobotBrandLoading3dClasses } from './stable';
import { styles } from './style';
import type { LobotBrandLoading3dProps } from './type';
import { useLiveLoading } from './useLiveLoading';

/**
 * Fits the jump and the bubbles above the head inside the box: the canvas of `AgentAvatar`,
 * scaled about its base.
 */
const STAGE = 'translate(50 95) scale(0.88) translate(-50 -92)';

/**
 * The Lobot mark as a faint, gray loader with implied volume: it crouches, jumps with a full
 * turn of the head, lands into a smile and then rolls its head around, while its two bubbles
 * circle above. Without motion it is the still mark.
 */
const LobotBrandLoading3d: FC<LobotBrandLoading3dProps> = ({
  size = 64,
  className,
  style,
  ...rest
}) => {
  const idPrefix = `${useId().replaceAll(/[^\w-]/g, '')}-`;
  const { isDarkMode } = useThemeMode();
  const animated = !useReducedMotion();
  const layers = useLiveLoading(animated, idPrefix);
  const still = useMemo(
    () => (layers.live ? null : buildStillScene('lobot', 'idle')),
    [layers.live],
  );

  return (
    <svg
      height={size}
      viewBox="0 0 100 100"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...toDataAttributes({ animated })}
      {...styleProps(
        [styles.root, isDarkMode && styles.dark],
        clsx(brandLobotBrandLoading3dClasses(), className),
        style,
      )}
      {...rest}
    >
      <title>Lobot</title>
      <defs ref={layers.defs} />
      <g transform={STAGE}>
        <g className={brandLobotBrandLoading3dClasses('bubbles')} ref={layers.bubbles}>
          {still?.extra && <path d={still.extra.d} transform={still.extra.transform} />}
        </g>
        <g className={brandLobotBrandLoading3dClasses('body')} ref={layers.body}>
          {still && <path d={still.body} />}
        </g>
        <g className={brandLobotBrandLoading3dClasses('eyes')} ref={layers.eyes}>
          {still?.eyes.map(({ pupil, sclera, smile, smileWidth, transform }, index) => (
            <g key={index} transform={transform}>
              {sclera && <path d={sclera} {...styleProps(styles.sclera)} />}
              {pupil && <path d={pupil} {...styleProps(styles.pupil)} />}
              {smile && <path d={smile} strokeWidth={smileWidth} {...styleProps(styles.smile)} />}
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
};

LobotBrandLoading3d.displayName = 'LobotBrandLoading3d';

export default LobotBrandLoading3d;
