'use client';

import './style.css';

import clsx from 'clsx';
import { AlertTriangle, CheckCircle, ChevronRight, Info, X, XCircle } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';

import Icon from '@/Icon';
import { focusRing } from '@/styles/stylex/focusRing';
import { styleProps } from '@/styles/stylex/props';

import { alertSummaryMarker } from './marker.stylex';
import { styles } from './style';
import type { AlertCloseConfig, AlertProps, AlertType, AlertVariant } from './type';

const typeIcons = {
  error: XCircle,
  info: Info,
  secondary: AlertTriangle,
  success: CheckCircle,
  warning: AlertTriangle,
} satisfies Record<AlertType, typeof Info>;

const toneStyles = {
  error: styles.toneError,
  info: styles.toneInfo,
  secondary: styles.toneSecondary,
  success: styles.toneSuccess,
  warning: styles.toneWarning,
} satisfies Record<AlertType, unknown>;

const rootVariantStyles = {
  borderless: styles.plain,
  filled: styles.soft,
  outlined: styles.outlined,
  plain: styles.plain,
  soft: styles.soft,
} satisfies Record<AlertVariant, unknown>;

const integratedVariantStyles = {
  borderless: styles.extraPlain,
  filled: styles.soft,
  outlined: styles.outlined,
  plain: styles.extraPlain,
  soft: styles.soft,
} satisfies Record<AlertVariant, unknown>;

const isPlainVariant = (variant: AlertVariant) => variant === 'borderless' || variant === 'plain';

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
        {...styleProps(
          [
            toneStyles[type],
            styles.root,
            banner && styles.banner,
            colorfulText ? styles.colorfulText : styles.neutralText,
            !integratedExtra && glass && styles.glass,
            hasDescription ? styles.detailed : styles.centered,
            rootVariantStyles[variant],
            integratedExtra && styles.unifiedRoot,
          ],
          clsx(classNames?.root, classNames?.alert, rootClassName, className),
          {
            ...style,
            ...customStyles?.root,
            ...customStyles?.alert,
          },
        )}
      >
        {showIcon && (
          <span
            aria-hidden="true"
            {...styleProps([styles.icon], classNames?.icon, customStyles?.icon)}
          >
            <Icon icon={icon ?? typeIcons[type]} size={hasDescription ? 18 : 16} {...iconProps} />
          </span>
        )}
        <div
          {...styleProps([styles.content], clsx(classNames?.section, classNames?.content), {
            ...customStyles?.section,
            ...customStyles?.content,
          })}
        >
          {resolvedTitle !== undefined && resolvedTitle !== null && (
            <div
              {...styleProps(
                [styles.title, hasDescription && styles.titleDetailed],
                classNames?.title,
                customStyles?.title,
              )}
            >
              {resolvedTitle}
            </div>
          )}
          {hasDescription && (
            <div
              {...styleProps(
                [styles.description],
                classNames?.description,
                customStyles?.description,
              )}
            >
              {description}
            </div>
          )}
        </div>
        {action && (
          <div
            {...styleProps(
              [styles.action, styles.wrappedAction],
              classNames?.action,
              customStyles?.action,
            )}
          >
            {action}
          </div>
        )}
        {isClosable && (
          <button
            {...closeButtonProps}
            aria-label={closeButtonProps['aria-label'] ?? 'Close alert'}
            disabled={closeDisabled}
            {...styleProps(
              [focusRing.info, styles.close],
              clsx(classNames?.close, closeClassName),
              { ...customStyles?.close, ...closeStyle },
            )}
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
          {...styleProps([styles.container, toneStyles[type]], classNames?.container, {
            gap: 8,
            ...customStyles?.container,
          })}
        >
          {root}
          {extra}
        </div>
      );
    }

    return (
      <div
        {...styleProps(
          [
            styles.container,
            toneStyles[type],
            styles.integrated,
            banner && styles.banner,
            glass && styles.glass,
            integratedVariantStyles[variant],
          ],
          classNames?.container,
          customStyles?.container,
        )}
      >
        {root}
        <div
          {...styleProps(
            [
              styles.extra,
              banner && styles.extraBanner,
              isPlainVariant(variant) && styles.extraPlain,
            ],
            classNames?.extra,
            customStyles?.extra,
          )}
        >
          <details
            open={extraExpanded}
            onToggle={(event) => setExtraExpanded(event.currentTarget.open)}
          >
            <summary
              {...styleProps(
                [
                  alertSummaryMarker,
                  focusRing.info,
                  styles.extraHeader,
                  isPlainVariant(variant) && styles.extraHeaderPlain,
                ],
                clsx('lobe-alert-extra-header', classNames?.extraHeader),
                customStyles?.extraHeader,
              )}
            >
              <ChevronRight
                aria-hidden="true"
                size={14}
                {...styleProps(
                  [styles.extraIndicator],
                  classNames?.extraIndicator,
                  customStyles?.extraIndicator,
                )}
              />
              <span>{text?.detail ?? 'Show Details'}</span>
            </summary>
            <div
              {...styleProps(
                [styles.extraContent],
                classNames?.extraContent,
                customStyles?.extraContent,
              )}
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
