'use client';

import { cx } from 'antd-style';
import { GlobeIcon } from 'lucide-react';

import Select from '@/base-ui/Select';
import Icon from '@/Icon';

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
      className={cx(styles.locale, className)}
      options={options}
      prefix={<Icon className={styles.localeIcon} icon={GlobeIcon} />}
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
