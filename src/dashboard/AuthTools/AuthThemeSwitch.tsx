'use client';

import { cx } from 'antd-style';
import { Monitor, Moon, Sun } from 'lucide-react';

import Segmented from '@/base-ui/Segmented';
import Icon from '@/Icon';

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
      className={cx(styles.theme, className)}
      size="small"
      style={style}
      value={value}
      variant="outlined"
      classNames={{
        indicator: styles.themeIndicator,
        item: styles.themeItem,
        itemIcon: styles.themeIcon,
        itemLabel: styles.themeLabel,
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
