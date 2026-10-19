'use client';

import './style.css';

import clsx from 'clsx';
import { GlobeIcon } from 'lucide-react';

import Icon from '@/Icon';
import Select from '@/Select';
import { styleProps } from '@/styles/stylex/props';

import { dashboardAuthLocaleSwitchClasses } from './stable';
import { styles } from './style';
import type { AuthLocaleSwitchProps } from './type';

/** Pill language select for auth corner tools. Controlled; pass your locale list. */
function AuthLocaleSwitch({
  'aria-label': ariaLabel = 'Language',
  className,
  onChange,
  options,
  style,
  value,
}: AuthLocaleSwitchProps) {
  return (
    <Select
      aria-label={ariaLabel}
      className={clsx(dashboardAuthLocaleSwitchClasses(), 'lobe-auth-locale-switch', className)}
      options={options}
      size="small"
      style={style}
      value={value}
      variant="outlined"
      prefix={
        <Icon
          icon={GlobeIcon}
          {...styleProps(styles.localeIcon, dashboardAuthLocaleSwitchClasses('icon'))}
        />
      }
      onChange={(next: unknown) => {
        if (typeof next === 'string') onChange?.(next);
      }}
    />
  );
}

AuthLocaleSwitch.displayName = 'AuthLocaleSwitch';

export default AuthLocaleSwitch;
