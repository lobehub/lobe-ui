'use client';

import { cssVar, cx } from 'antd-style';
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

    // With inner text the switch grows to fit it (antd): an invisible sizer reserves the width
    // of the longer label and the thumb travels the measured track.
    const hasText = !!(checkedChildren || unCheckedChildren);

    return (
      <SwitchRoot
        autoFocus={autoFocus}
        checked={resolvedChecked}
        defaultChecked={resolvedDefaultChecked}
        disabled={isDisabled}
        id={id}
        name={name}
        ref={ref}
        size={size}
        style={{ ...style, ...customStyles?.root }}
        tabIndex={tabIndex}
        title={title}
        className={cx(
          hasText && (size === 'small' ? styles.rootTextSmall : styles.rootText),
          className,
          rootClassName,
          classNames?.root,
        )}
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
        {hasText && (
          <span
            aria-hidden
            className={cx(styles.textSizer, size === 'small' && styles.textSizerSmall)}
          >
            <span>{checkedChildren}</span>
            <span>{unCheckedChildren}</span>
          </span>
        )}
        <SwitchThumb className={classNames?.thumb} size={size} style={customStyles?.thumb}>
          {loading && (
            <Icon
              className={styles.loading}
              icon={Loader2}
              size={size === 'small' ? 8 : 12}
              style={{ color: cssVar.colorPrimary }}
            />
          )}
        </SwitchThumb>
      </SwitchRoot>
    );
  },
);

Switch.displayName = 'Switch';

export default Switch;
