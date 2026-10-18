'use client';

import './style.css';

import clsx from 'clsx';
import { Monitor, Moon, Sun } from 'lucide-react';

import Icon from '@/Icon';
import Segmented from '@/Segmented';
import { styleProps } from '@/styles/stylex/props';

import { dashboardAuthThemeSwitchClasses } from './stable';
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
      className={clsx(dashboardAuthThemeSwitchClasses(), 'lobe-auth-theme-switch', className)}
      size="small"
      style={style}
      value={value}
      variant="outlined"
      classNames={{
        item: clsx(dashboardAuthThemeSwitchClasses('item'), 'lobe-auth-theme-switch-item'),
        itemIcon: styleProps(styles.themeIcon, dashboardAuthThemeSwitchClasses('icon')).className,
        itemLabel: styleProps(styles.themeLabel, dashboardAuthThemeSwitchClasses('label'))
          .className,
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
