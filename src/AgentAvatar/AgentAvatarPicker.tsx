'use client';

import clsx from 'clsx';
import { memo } from 'react';

import { useControlledState } from '@/hooks/useControlledState';
import agentAvatarMessages from '@/i18n/resources/en/agentAvatar';
import { useTranslation } from '@/i18n/useTranslation';
import { focusRing } from '@/styles/stylex/focusRing';
import { styleProps } from '@/styles/stylex/props';
import { useThemeMode } from '@/styles/theme/scope';

import AgentAvatar from './AgentAvatar';
import { styles } from './pickerStyle';
import { agentAvatarPickerClasses } from './stable';
import type { AgentAvatarPickerProps, AgentAvatarValue } from './type';
import { AGENT_AVATAR_COLOR_TOKENS, AGENT_AVATAR_COLORS, AGENT_AVATAR_SHAPES } from './utils';

const DEFAULT_VALUE: AgentAvatarValue = { color: 'geekblue', shape: 'lobot' };

const AgentAvatarPicker = memo<AgentAvatarPickerProps>(
  ({ className, defaultValue, onChange, preview = true, ref, style, texts, value, ...rest }) => {
    const { t } = useTranslation(agentAvatarMessages);
    const { isDarkMode } = useThemeMode();
    const [current, setCurrent] = useControlledState<AgentAvatarValue>(
      { ...DEFAULT_VALUE, ...defaultValue },
      {
        defaultValue: { ...DEFAULT_VALUE, ...defaultValue },
        onChange: onChange && ((next) => onChange(next)),
        value,
      },
    );

    return (
      <div
        ref={ref}
        {...rest}
        {...styleProps([styles.root], clsx(agentAvatarPickerClasses(), className), style)}
      >
        {preview && (
          <div {...styleProps([styles.preview], agentAvatarPickerClasses('preview'))}>
            <AgentAvatar
              animated
              followPointer
              color={current.color}
              shape={current.shape}
              size={88}
            />
          </div>
        )}
        <div
          aria-label={texts?.shapes ?? t('agentAvatar.shapes')}
          role="group"
          {...styleProps([styles.shapes], agentAvatarPickerClasses('shapes'))}
        >
          {AGENT_AVATAR_SHAPES.map((shape) => {
            const label = t(`agentAvatar.shape.${shape}`);
            const active = shape === current.shape;
            return (
              <button
                aria-label={label}
                aria-pressed={active}
                key={shape}
                title={label}
                type="button"
                onClick={() => setCurrent({ ...current, shape })}
                {...styleProps(
                  [styles.shape, active && styles.shapeActive, focusRing.info],
                  agentAvatarPickerClasses('shape'),
                )}
              >
                <AgentAvatar color={current.color} shape={shape} size={36} tilt={false} />
              </button>
            );
          })}
        </div>
        <div
          aria-label={texts?.colors ?? t('agentAvatar.colors')}
          role="group"
          {...styleProps([styles.colors], agentAvatarPickerClasses('colors'))}
        >
          {AGENT_AVATAR_COLORS.map((color) => {
            const label = t(`agentAvatar.color.${color}`);
            const active = color === current.color;
            return (
              <button
                aria-label={label}
                aria-pressed={active}
                key={color}
                title={label}
                type="button"
                onClick={() => setCurrent({ ...current, color })}
                {...styleProps(
                  [styles.color, active && styles.colorActive, focusRing.info],
                  agentAvatarPickerClasses('color'),
                  { background: AGENT_AVATAR_COLOR_TOKENS[color][isDarkMode ? 'dark' : 'light'] },
                )}
              />
            );
          })}
        </div>
      </div>
    );
  },
);

AgentAvatarPicker.displayName = 'AgentAvatarPicker';

export default AgentAvatarPicker;
