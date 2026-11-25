'use client';

import clsx from 'clsx';
import { type CSSProperties, memo, useId, useMemo } from 'react';

import { styleProps } from '@/styles/stylex/props';
import { useThemeMode } from '@/styles/theme/scope';
import { toDataAttributes } from '@/utils/bem';

import { agentAvatarClasses } from './stable';
import { buildStillScene } from './still';
import { styles } from './style';
import type { AgentAvatarProps } from './type';
import { useLiveAvatar } from './useLiveAvatar';
import { useReducedMotion } from './useReducedMotion';
import {
  AGENT_AVATAR_COLOR_TOKENS,
  getAgentAvatarTraits,
  isAgentAvatarColor,
  PUPIL_COLOR,
  SCLERA_COLOR,
} from './utils';

/** Center of the `blocked` badge: the bottom-right corner, clear of ears and antennas. */
const BADGE = [86, 86] as const;
/** Thought bubbles in the top-right corner of the box: center and radius, largest first. */
const THOUGHT_DOTS = [
  [73, 17, 6],
  [84, 10, 4.4],
  [92.5, 5.5, 3],
] as const;

const AgentAvatar = memo<AgentAvatarProps>(
  ({
    'animated': animatedProp = false,
    'aria-label': ariaLabel,
    className,
    classNames,
    'color': colorProp,
    followPointer = false,
    name,
    ref,
    seed,
    'shape': shapeProp,
    size,
    state = 'idle',
    style,
    'styles': customStyles,
    tilt = true,
    ...rest
  }) => {
    const idPrefix = `${useId().replaceAll(/[^\w-]/g, '')}-`;
    const { isDarkMode } = useThemeMode();
    const reducedMotion = useReducedMotion();
    const animated = animatedProp && !reducedMotion;

    const traits = getAgentAvatarTraits(seed ?? name ?? '');
    const shape = shapeProp ?? traits.shape;
    const colorKey = colorProp ?? traits.color;
    const isPreset = isAgentAvatarColor(colorKey);
    const color = isPreset
      ? AGENT_AVATAR_COLOR_TOKENS[colorKey][isDarkMode ? 'dark' : 'light']
      : colorKey;

    const layers = useLiveAvatar({
      enabled: animated,
      followPointer,
      idPrefix,
      phase: -traits.phase,
      shape,
      state,
    });

    const still = useMemo(
      () => (layers.live ? null : buildStillScene(shape, state)),
      [layers.live, shape, state],
    );

    const label = ariaLabel ?? name;
    // Only the body and eyes lean; the badge and thought bubbles stay upright.
    const lean = tilt ? traits.tilt : 0;
    const motion = <T,>(value: T) => (animated ? value : undefined);

    return (
      <svg
        aria-hidden={label ? undefined : true}
        aria-label={label}
        ref={ref}
        role={label ? 'img' : undefined}
        viewBox="0 0 100 100"
        {...toDataAttributes({
          animated,
          color: isPreset ? colorKey : undefined,
          shape,
          state,
        })}
        {...rest}
        {...styleProps([styles.root], clsx(agentAvatarClasses(), className, classNames?.root), {
          '--lobe-agent-avatar-color': color,
          ...(size !== undefined && { height: size, width: size }),
          ...customStyles?.root,
          ...style,
        } as CSSProperties)}
      >
        <defs ref={layers.defs} />
        <g transform={lean ? `rotate(${lean} 50 50)` : undefined}>
          <g transform={still?.stage}>
            <g
              ref={layers.body}
              style={customStyles?.body}
              className={
                styleProps([styles.body], clsx(agentAvatarClasses('body'), classNames?.body))
                  .className
              }
            >
              {still && <path d={still.body} />}
              {still?.extra && <path d={still.extra.d} transform={still.extra.transform} />}
            </g>
            <g
              className={clsx(agentAvatarClasses('eyes'), classNames?.eyes)}
              ref={layers.eyes}
              style={customStyles?.eyes}
            >
              {still?.eyes.map(({ pupil, sclera, smile, smileWidth, transform }, index) => (
                <g key={index} transform={transform}>
                  {sclera && <path d={sclera} fill={SCLERA_COLOR} />}
                  {pupil && <path d={pupil} fill={PUPIL_COLOR} />}
                  {smile && (
                    <path
                      d={smile}
                      fill="none"
                      stroke={SCLERA_COLOR}
                      strokeLinecap="round"
                      strokeWidth={smileWidth}
                    />
                  )}
                </g>
              ))}
            </g>
          </g>
        </g>
        {state === 'thinking' && (
          <g
            className={clsx(agentAvatarClasses('thought'), classNames?.thought)}
            style={customStyles?.thought}
          >
            {THOUGHT_DOTS.map(([cx, cy, r], index) => (
              <circle
                className={styleProps([styles.thoughtDot, motion(styles.thoughtMotion)]).className}
                cx={cx}
                cy={cy}
                key={r}
                r={r}
                style={animated ? { animationDelay: `${index * 0.22}s` } : undefined}
              />
            ))}
          </g>
        )}
        {state === 'blocked' && (
          <g
            style={customStyles?.badge}
            className={
              styleProps(
                [styles.badge, motion(styles.badgeMotion)],
                clsx(agentAvatarClasses('badge'), classNames?.badge),
              ).className
            }
          >
            <circle
              className={styleProps([styles.badgeRing]).className}
              cx={BADGE[0]}
              cy={BADGE[1]}
              r={13}
            />
            <circle
              className={styleProps([styles.badgeDot]).className}
              cx={BADGE[0]}
              cy={BADGE[1]}
              r={10.5}
            />
            <rect
              className={styleProps([styles.badgeMark]).className}
              height={8}
              rx={1.4}
              width={2.8}
              x={BADGE[0] - 1.4}
              y={BADGE[1] - 7}
            />
            <circle
              className={styleProps([styles.badgeMark]).className}
              cx={BADGE[0]}
              cy={BADGE[1] + 5}
              r={1.7}
            />
          </g>
        )}
      </svg>
    );
  },
);

AgentAvatar.displayName = 'AgentAvatar';

export default AgentAvatar;
