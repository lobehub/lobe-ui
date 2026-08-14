'use client';

import { cx } from 'antd-style';
import { AlertTriangle, CheckCircle, ChevronRight, Info, X, XCircle } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';

import Icon from '@/Icon';

import {
  extraHeaderVariants,
  extraVariants,
  integratedVariants,
  rootVariants,
  styles,
  toneVariants,
} from './style';
import type { AlertCloseConfig, AlertProps, AlertType } from './type';

const typeIcons = {
  error: XCircle,
  info: Info,
  secondary: AlertTriangle,
  success: CheckCircle,
  warning: AlertTriangle,
} satisfies Record<AlertType, typeof Info>;

const Alert = memo<AlertProps>(
  ({
    action,
    afterClose,
    banner = false,
    className,
    classNames,
    closable = false,
    closeIcon,
    closeText,
    colorfulText = false,
    description,
    extra,
    extraDefaultExpand = false,
    extraIsolate = false,
    glass = false,
    icon,
    iconProps,
    message,
    onClose,
    ref,
    role = 'alert',
    rootClassName,
    showIcon = true,
    style,
    styles: customStyles,
    text,
    title,
    type = 'info',
    variant = 'soft',
    ...rest
  }) => {
    const [closed, setClosed] = useState(false);
    const [extraExpanded, setExtraExpanded] = useState(extraDefaultExpand);
    const resolvedTitle = title ?? message;
    const hasDescription = description !== undefined && description !== null;
    const integratedExtra = Boolean(extra && !extraIsolate);
    const closeConfig: AlertCloseConfig = typeof closable === 'object' ? closable : {};
    const isClosable = Boolean(closable);
    const {
      afterClose: configuredAfterClose,
      closeIcon: configuredCloseIcon,
      className: closeClassName,
      disabled: closeDisabled,
      onClose: configuredOnClose,
      style: closeStyle,
      ...closeButtonProps
    } = closeConfig;
    const afterCloseRef = useRef(configuredAfterClose ?? afterClose);
    afterCloseRef.current = configuredAfterClose ?? afterClose;

    useEffect(() => {
      if (closed) afterCloseRef.current?.();
    }, [closed]);

    if (closed) return null;

    const handleClose: NonNullable<AlertCloseConfig['onClose']> = (event) => {
      (configuredOnClose ?? onClose)?.(event);
      setClosed(true);
    };

    const root = (
      <div
        {...rest}
        data-alert-type={type}
        data-alert-variant={variant}
        ref={ref}
        role={role}
        className={cx(
          toneVariants({ type }),
          rootVariants({
            banner,
            colorfulText,
            glass: integratedExtra ? false : glass,
            hasDescription,
            hasExtra: integratedExtra,
            variant,
          }),
          classNames?.root,
          classNames?.alert,
          rootClassName,
          className,
        )}
        style={{
          ...style,
          ...customStyles?.root,
          ...customStyles?.alert,
        }}
      >
        {showIcon && (
          <span
            aria-hidden="true"
            className={cx(styles.icon, classNames?.icon)}
            style={customStyles?.icon}
          >
            <Icon icon={icon ?? typeIcons[type]} size={hasDescription ? 20 : 18} {...iconProps} />
          </span>
        )}
        <div
          className={cx(styles.content, classNames?.section, classNames?.content)}
          style={{ ...customStyles?.section, ...customStyles?.content }}
        >
          {resolvedTitle !== undefined && resolvedTitle !== null && (
            <div
              style={customStyles?.title}
              className={cx(
                styles.title,
                hasDescription && styles.titleDetailed,
                classNames?.title,
              )}
            >
              {resolvedTitle}
            </div>
          )}
          {hasDescription && (
            <div
              className={cx(styles.description, classNames?.description)}
              style={customStyles?.description}
            >
              {description}
            </div>
          )}
        </div>
        {action && (
          <div
            className={cx(styles.action, styles.wrappedAction, classNames?.action)}
            style={customStyles?.action}
          >
            {action}
          </div>
        )}
        {isClosable && (
          <button
            {...closeButtonProps}
            aria-label={closeButtonProps['aria-label'] ?? 'Close alert'}
            className={cx(styles.close, classNames?.close, closeClassName)}
            disabled={closeDisabled}
            style={{ ...customStyles?.close, ...closeStyle }}
            type="button"
            onClick={handleClose}
          >
            {configuredCloseIcon ?? closeIcon ?? closeText ?? <X size={14} />}
          </button>
        )}
      </div>
    );

    if (!extra) return root;

    if (extraIsolate) {
      return (
        <div
          className={cx(styles.container, toneVariants({ type }), classNames?.container)}
          style={{ gap: 8, ...customStyles?.container }}
        >
          {root}
          {extra}
        </div>
      );
    }

    return (
      <div
        style={customStyles?.container}
        className={cx(
          styles.container,
          toneVariants({ type }),
          integratedVariants({ banner, glass, variant }),
          classNames?.container,
        )}
      >
        {root}
        <div
          className={cx(extraVariants({ banner, variant }), classNames?.extra)}
          style={customStyles?.extra}
        >
          <details
            open={extraExpanded}
            onToggle={(event) => setExtraExpanded(event.currentTarget.open)}
          >
            <summary
              className={cx(extraHeaderVariants({ variant }), classNames?.extraHeader)}
              style={customStyles?.extraHeader}
            >
              <ChevronRight
                aria-hidden="true"
                className={cx(styles.extraIndicator, classNames?.extraIndicator)}
                size={14}
                style={customStyles?.extraIndicator}
              />
              <span>{text?.detail ?? 'Show Details'}</span>
            </summary>
            <div
              className={cx(styles.extraContent, classNames?.extraContent)}
              style={customStyles?.extraContent}
            >
              {extra}
            </div>
          </details>
        </div>
      </div>
    );
  },
);

Alert.displayName = 'BaseAlert';

export default Alert;
