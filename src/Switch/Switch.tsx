'use client';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import { memo, useId } from 'react';

import Icon from '@/Icon';
import { a2uiStyles } from '@/internal/a2ui/styles';
import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { SwitchIcon, SwitchRoot, SwitchThumb } from './atoms';
import { switchClasses } from './stable';
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
    description,
    disabled,
    id,
    label,
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
    variant = 'default',
    ...rest
  }) => {
    const autoId = useId();
    const isDisabled = disabled || loading;
    const resolvedChecked = value ?? checked;
    const resolvedDefaultChecked = defaultValue ?? defaultChecked;

    // With inner text the switch grows to fit it (antd): an invisible sizer reserves the width
    // of the longer label and the thumb travels the measured track.
    const hasText = !!(checkedChildren || unCheckedChildren);

    if (variant === 'a2ui') {
      // Adapted from CopilotKit a2ui-playground (MIT): renderers/inputs.tsx `Switch`, a well row
      // with the label and description on the left and a shadcn switch on the right.
      const switchId = id ?? autoId;
      const control = (
        <SwitchRoot
          {...toDataAttributes({ loading, variant })}
          {...rest}
          autoFocus={autoFocus}
          checked={resolvedChecked}
          className={clsx(className, rootClassName, classNames?.root)}
          defaultChecked={resolvedDefaultChecked}
          disabled={isDisabled}
          id={switchId}
          name={name}
          ref={ref}
          style={{ ...style, ...customStyles?.root }}
          tabIndex={tabIndex}
          title={title}
          xstyle={styles.a2uiRoot}
          onCheckedChange={onChange}
          onClick={onClick}
        >
          <SwitchThumb className={classNames?.thumb} style={customStyles?.thumb} variant="a2ui" />
        </SwitchRoot>
      );
      if (label == null && description == null) return control;
      return (
        <div
          {...toDataAttributes({ variant })}
          {...styleProps(
            [a2uiStyles.base, a2uiStyles.well, styles.a2uiWell],
            clsx(switchClasses('field'), classNames?.field),
            customStyles?.field,
          )}
        >
          <div {...styleProps(styles.a2uiText)}>
            {label != null && (
              <label
                htmlFor={switchId}
                {...styleProps(
                  styles.a2uiLabel,
                  clsx(switchClasses('label'), classNames?.label),
                  customStyles?.label,
                )}
              >
                {label}
              </label>
            )}
            {description != null && (
              <p
                {...styleProps(
                  styles.a2uiDescription,
                  clsx(switchClasses('description'), classNames?.description),
                  customStyles?.description,
                )}
              >
                {description}
              </p>
            )}
          </div>
          {control}
        </div>
      );
    }

    return (
      <SwitchRoot
        {...toDataAttributes({ loading })}
        {...rest}
        autoFocus={autoFocus}
        checked={resolvedChecked}
        className={clsx(hasText && 'lobe-switch-text', className, rootClassName, classNames?.root)}
        defaultChecked={resolvedDefaultChecked}
        disabled={isDisabled}
        id={id}
        name={name}
        ref={ref}
        size={size}
        style={{ ...style, ...customStyles?.root }}
        tabIndex={tabIndex}
        title={title}
        xstyle={hasText && (size === 'small' ? styles.rootTextSmall : styles.rootText)}
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
            {...stylex.props(styles.textSizer, size === 'small' && styles.textSizerSmall)}
          >
            <span>{checkedChildren}</span>
            <span>{unCheckedChildren}</span>
          </span>
        )}
        <SwitchThumb className={classNames?.thumb} size={size} style={customStyles?.thumb}>
          {loading && (
            <Icon
              {...stylex.props(styles.loading)}
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
