'use client';

import './style.css';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { Monitor, Moon, Sun } from 'lucide-react';

import Icon from '@/Icon';
import Segmented from '@/Segmented';

import { styles } from './style';
import type { AuthThemeMode, AuthThemeSwitchProps } from './type';

const OPTIONS = [
  { icon: Moon, value: 'dark' },
  { icon: Monitor, value: 'auto' },
  { icon: Sun, value: 'light' },
] as const;

const DEFAULT_LABELS: Record<AuthThemeMode, string> = {
  auto: 'System',
  dark: 'Dark',
  light: 'Light',
};

/** Compact icon-only theme picker for auth corner tools. Controlled; wire it to your store. */
function AuthThemeSwitch({
  className,
  labels,
  onChange,
  style,
  value = 'auto',
}: AuthThemeSwitchProps) {
  const names = { ...DEFAULT_LABELS, ...labels };
  return (
    <Segmented<AuthThemeMode>
      className={clsx('lobe-auth-theme-switch', className)}
      size="small"
      style={style}
      value={value}
      variant="outlined"
      classNames={{
        item: 'lobe-auth-theme-switch-item',
        itemIcon: stylex.props(styles.themeIcon).className,
        itemLabel: stylex.props(styles.themeLabel).className,
      }}
      options={OPTIONS.map((option) => ({
        icon: <Icon icon={option.icon} />,
        label: names[option.value],
        title: names[option.value],
        value: option.value,
      }))}
      onChange={(next) => onChange?.(next)}
    />
  );
}

AuthThemeSwitch.displayName = 'AuthThemeSwitch';

export default AuthThemeSwitch;
