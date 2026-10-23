'use client';

import clsx from 'clsx';
import { type CSSProperties, memo, type ReactNode, useId } from 'react';

import { styleProps } from '@/styles/stylex/props';
import { useThemeMode } from '@/styles/theme/scope';
import { toDataAttributes } from '@/utils/bem';

import { happyEyePath, scleraPath, SHAPE_GEOMETRY } from './shapes';
import { agentAvatarClasses } from './stable';
import { styles } from './style';
import type { AgentAvatarProps, AgentAvatarState } from './type';
import { useReducedMotion } from './useReducedMotion';
import {
  AGENT_AVATAR_COLOR_TOKENS,
  BLOCKED_PUPIL_RATIO,
  BLOCKED_SCLERA_SCALE,
  GAZE_UNIT_RADIUS,
  getAgentAvatarTraits,
  isAgentAvatarColor,
  PUPIL_COLOR,
  PUPIL_RATIO,
  PUPIL_RATIO_SMALL,
  SCLERA_COLOR,
  SMALL_SIZE,
  STILL_GAZE,
} from './utils';

const round = (value: number) => Math.round(value * 100) / 100;

const BODY_MOTION = {
  blocked: styles.bodyBlocked,
  done: styles.bodyDone,
  idle: styles.bodyIdle,
  thinking: styles.bodyThinking,
  waiting: styles.bodyWaiting,
  working: styles.bodyWorking,
} satisfies Record<AgentAvatarState, unknown>;

const BLINK_MOTION = {
  idle: styles.blinkIdle,
  thinking: styles.blinkThinking,
  waiting: styles.blinkWaiting,
  working: styles.blinkWorking,
} satisfies Partial<Record<AgentAvatarState, unknown>>;

const GAZE_MOTION = {
  idle: styles.gazeIdle,
  thinking: styles.gazeThinking,
  working: styles.gazeWorking,
} satisfies Partial<Record<AgentAvatarState, unknown>>;

/** Thought bubbles: offset from the anchor and radius, smallest last. */
const THOUGHT_DOTS: [number, number, number][] = [
  [0, 8, 8.5],
  [12, 2, 6.5],
  [20, -5, 4.5],
];

const AgentAvatar = memo<AgentAvatarProps>(
  ({
    'animated': animatedProp = false,
    'aria-label': ariaLabel,
    className,
    classNames,
    'color': colorProp,
    name,
    ref,
    seed,
    'shape': shapeProp,
    size,
    state = 'idle',
    style,
    'styles': customStyles,
    ...rest
  }) => {
    const id = useId().replaceAll(/[^\w-]/g, '');
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

    const geometry = SHAPE_GEOMETRY[shape];
    const { gap, r: baseRadius, y: eyeY } = geometry.eyes;
    const eyeXs = [50 - gap / 2, 50 + gap / 2];
    const gazeScale = baseRadius / GAZE_UNIT_RADIUS;
    const blocked = state === 'blocked';
    const radius = blocked ? baseRadius * BLOCKED_SCLERA_SCALE : baseRadius;
    const small = size !== undefined && size <= SMALL_SIZE;
    const pupilRadius =
      baseRadius * (blocked ? BLOCKED_PUPIL_RATIO : small ? PUPIL_RATIO_SMALL : PUPIL_RATIO);
    const [gazeX, gazeY] = STILL_GAZE[state];

    const label = ariaLabel ?? name;
    const motion = <T,>(value: T) => (animated ? value : undefined);

    const eyes = (
      <>
        <defs>
          <clipPath id={`${id}-eyes`}>
            {eyeXs.map((x) => (
              <path d={scleraPath(x, eyeY, radius)} key={x} />
            ))}
          </clipPath>
        </defs>
        {eyeXs.map((x) => (
          <path d={scleraPath(x, eyeY, radius)} fill={SCLERA_COLOR} key={x} />
        ))}
        <g clipPath={`url(#${id}-eyes)`}>
          <g
            className={
              styleProps([styles.pupils, motion(GAZE_MOTION[state as keyof typeof GAZE_MOTION])])
                .className
            }
            style={
              {
                '--lobe-agent-avatar-gaze': String(round(gazeScale)),
                'transform': `translate(${round(gazeX * gazeScale)}px, ${round(gazeY * gazeScale)}px)`,
              } as CSSProperties
            }
          >
            {eyeXs.map((x) => (
              <circle cx={x} cy={eyeY} fill={PUPIL_COLOR} key={x} r={round(pupilRadius)} />
            ))}
          </g>
        </g>
      </>
    );

    const closedEyes = (
      <g
        fill="none"
        stroke={SCLERA_COLOR}
        strokeLinecap="round"
        strokeWidth={round((small ? 7.5 : 6.5) * gazeScale)}
      >
        {eyeXs.map((x) => (
          <path d={happyEyePath(x, eyeY, baseRadius)} key={x} />
        ))}
      </g>
    );

    const eyesClassName = clsx(agentAvatarClasses('eyes'), classNames?.eyes);
    let eyeLayer: ReactNode;
    if (state === 'done') {
      eyeLayer = (
        <g
          className={styleProps([styles.eyes], eyesClassName).className}
          style={customStyles?.eyes}
        >
          {animated && (
            <g className={styleProps([styles.eyesOpenLate]).className} opacity={0}>
              {eyes}
            </g>
          )}
          <g className={styleProps([motion(styles.eyesClosedEarly)]).className || undefined}>
            {closedEyes}
          </g>
        </g>
      );
    } else {
      eyeLayer = (
        <g
          style={{ transformOrigin: `50px ${eyeY}px`, ...customStyles?.eyes }}
          className={
            styleProps(
              [styles.eyes, motion(BLINK_MOTION[state as keyof typeof BLINK_MOTION])],
              eyesClassName,
            ).className
          }
        >
          {eyes}
        </g>
      );
    }

    const [badgeX, badgeY] = geometry.badge;
    const [thoughtX, thoughtY] = geometry.thought;

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
          ...(animated && { '--lobe-agent-avatar-delay': `${traits.phase}s` }),
          ...(size !== undefined && { height: size, width: size }),
          ...customStyles?.root,
          ...style,
        } as CSSProperties)}
      >
        <g
          className={styleProps([styles.bodyMotion, motion(BODY_MOTION[state])]).className}
          style={state === 'waiting' ? { transform: 'rotate(-3deg)' } : undefined}
        >
          <path
            d={geometry.d}
            style={customStyles?.body}
            className={
              styleProps([styles.body], clsx(agentAvatarClasses('body'), classNames?.body))
                .className
            }
          />
          {eyeLayer}
        </g>
        {state === 'thinking' && (
          <g
            className={clsx(agentAvatarClasses('thought'), classNames?.thought)}
            style={customStyles?.thought}
          >
            {THOUGHT_DOTS.map(([dx, dy, r], index) => (
              <circle
                className={styleProps([styles.thoughtDot, motion(styles.thoughtRise)]).className}
                cx={thoughtX + dx}
                cy={thoughtY + dy}
                key={r}
                opacity={round(0.9 - index * 0.15)}
                r={r}
                style={
                  animated
                    ? {
                        animationDelay: `calc(var(--lobe-agent-avatar-delay, 0s) + ${round(index * 0.35)}s)`,
                      }
                    : undefined
                }
              />
            ))}
          </g>
        )}
        {blocked && (
          <g
            style={customStyles?.badge}
            className={
              styleProps(
                [motion(styles.badgeMotion)],
                clsx(agentAvatarClasses('badge'), classNames?.badge),
              ).className
            }
          >
            <circle
              className={styleProps([styles.badgeRing]).className}
              cx={badgeX}
              cy={badgeY}
              r={11.5}
            />
            <circle
              className={styleProps([styles.badgeDot]).className}
              cx={badgeX}
              cy={badgeY}
              r={9}
            />
            <rect
              className={styleProps([styles.badgeMark]).className}
              height={6.8}
              rx={1.25}
              width={2.5}
              x={badgeX - 1.25}
              y={badgeY - 6.2}
            />
            <circle
              className={styleProps([styles.badgeMark]).className}
              cx={badgeX}
              cy={badgeY + 4.4}
              r={1.45}
            />
          </g>
        )}
      </svg>
    );
  },
);

AgentAvatar.displayName = 'AgentAvatar';

export default AgentAvatar;
