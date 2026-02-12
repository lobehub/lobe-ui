'use client';

import { cx } from 'antd-style';
import { Loader2 } from 'lucide-react';
import { memo } from 'react';

import Icon from '@/Icon';

import { SwitchIcon, SwitchRoot, SwitchThumb } from './atoms';
import { styles } from './style';
import type { SwitchProps } from './type';

const Switch = memo<SwitchProps>(
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
      <SwitchRoot
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
          <SwitchIcon
            className={classNames?.content}
            position="left"
            size={size}
            style={customStyles?.content}
          >
            {checkedChildren}
          </SwitchIcon>
        )}
        {unCheckedChildren && (
          <SwitchIcon
            className={classNames?.content}
            position="right"
            size={size}
            style={customStyles?.content}
          >
            {unCheckedChildren}
          </SwitchIcon>
        )}
        <SwitchThumb className={classNames?.thumb} size={size} style={customStyles?.thumb}>
          {loading && (
            <Icon
              className={styles.loading}
              icon={Loader2}
              size={size === 'small' ? 8 : 12}
              style={{ color: 'var(--lobe-color-primary)' }}
            />
          )}
        </SwitchThumb>
      </SwitchRoot>
    );
  },
);

Switch.displayName = 'Switch';

export default Switch;
