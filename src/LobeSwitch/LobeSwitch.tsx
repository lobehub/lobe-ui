'use client';

import { cx } from 'antd-style';
import { Loader2 } from 'lucide-react';
import { memo } from 'react';

import Icon from '@/Icon';

import { LobeSwitchIcon, LobeSwitchRoot, LobeSwitchThumb } from './atoms';
import { styles } from './style';
import type { LobeSwitchProps } from './type';

const LobeSwitch = memo<LobeSwitchProps>(
  ({
    autoFocus,
    checked,
    checkedChildren,
    className,
    classNames,
    defaultChecked,
    defaultValue,
    disabled,
    id,
    loading,
    name,
    onChange,
    onClick,
    ref,
    rootClassName,
    size = 'default',
    style,
    styles: customStyles,
    tabIndex,
    title,
    unCheckedChildren,
    value,
  }) => {
    const isDisabled = disabled || loading;
    const resolvedChecked = value ?? checked;
    const resolvedDefaultChecked = defaultValue ?? defaultChecked;

    return (
      <LobeSwitchRoot
        autoFocus={autoFocus}
        checked={resolvedChecked}
        className={cx(className, rootClassName, classNames?.root)}
        defaultChecked={resolvedDefaultChecked}
        disabled={isDisabled}
        id={id}
        name={name}
        ref={ref}
        size={size}
        style={{ ...style, ...customStyles?.root }}
        tabIndex={tabIndex}
        title={title}
        onCheckedChange={onChange}
        onClick={onClick}
      >
        {checkedChildren && (
          <LobeSwitchIcon
            className={classNames?.content}
            position="left"
            size={size}
            style={customStyles?.content}
          >
            {checkedChildren}
          </LobeSwitchIcon>
        )}
        {unCheckedChildren && (
          <LobeSwitchIcon
            className={classNames?.content}
            position="right"
            size={size}
            style={customStyles?.content}
          >
            {unCheckedChildren}
          </LobeSwitchIcon>
        )}
        <LobeSwitchThumb className={classNames?.thumb} size={size} style={customStyles?.thumb}>
          {loading && (
            <Icon
              className={styles.loading}
              icon={Loader2}
              size={size === 'small' ? 8 : 12}
              style={{ color: 'var(--lobe-color-primary)' }}
            />
          )}
        </LobeSwitchThumb>
      </LobeSwitchRoot>
    );
  },
);

LobeSwitch.displayName = 'LobeSwitch';

export default LobeSwitch;
