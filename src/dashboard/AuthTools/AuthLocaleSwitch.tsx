'use client';

import './style.css';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { GlobeIcon } from 'lucide-react';

import Icon from '@/Icon';
import Select from '@/Select';

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
      className={clsx('lobe-auth-locale-switch', className)}
      options={options}
      prefix={<Icon icon={GlobeIcon} {...stylex.props(styles.localeIcon)} />}
      size="small"
      style={style}
      value={value}
      variant="outlined"
      onChange={(next: unknown) => {
        if (typeof next === 'string') onChange?.(next);
      }}
    />
  );
}

AuthLocaleSwitch.displayName = 'AuthLocaleSwitch';

export default AuthLocaleSwitch;
