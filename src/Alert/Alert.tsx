'use client';

import './style.css';

import clsx from 'clsx';
import {
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  CircleCheck,
  CircleX,
  Info,
  Lightbulb,
  X,
  XCircle,
} from 'lucide-react';
import { memo, type ReactNode, useEffect, useRef, useState } from 'react';

import Button, { type ButtonProps } from '@/Button';
import Icon from '@/Icon';
import A2uiButton, { isA2uiActionConfig } from '@/internal/a2ui/A2uiButton';
import { a2uiStyles } from '@/internal/a2ui/styles';
import { focusRing } from '@/styles/stylex/focusRing';
import { styleProps } from '@/styles/stylex/props';

import { a2uiAlertIconTone, a2uiAlertStyles, a2uiAlertTone } from './a2uiStyle';
import { alertSummaryMarker } from './marker.stylex';
import { alertClasses } from './stable';
import { styles } from './style';
import type { AlertCloseConfig, AlertProps, AlertType, AlertVariant } from './type';

const typeIcons = {
  error: XCircle,
  info: Info,
  secondary: AlertTriangle,
  success: CheckCircle,
  warning: AlertTriangle,
} satisfies Record<AlertType, typeof Info>;

// The playground's Alert icons (CopilotKit a2ui-playground, MIT).
const a2uiTypeIcons = {
  error: CircleX,
  info: Info,
  secondary: Info,
  success: CircleCheck,
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
  'borderless': styles.plain,
  'filled': styles.soft,
  'outlined': styles.outlined,
  'plain': styles.plain,
  'soft': styles.soft,
  'a2ui': styles.soft,
  'a2ui-callout': styles.soft,
} satisfies Record<AlertVariant, unknown>;

const integratedVariantStyles = {
  'borderless': styles.extraPlain,
  'filled': styles.soft,
  'outlined': styles.outlined,
  'plain': styles.extraPlain,
  'soft': styles.soft,
  'a2ui': styles.soft,
  'a2ui-callout': styles.soft,
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

    const isA2ui = variant === 'a2ui' || variant === 'a2ui-callout';
    const actionNode: ReactNode = isA2uiActionConfig(action) ? (
      isA2ui ? (
        <A2uiButton disabled={action.disabled} onClick={action.onClick}>
          {action.label}
        </A2uiButton>
      ) : (
        <Button
          disabled={action.disabled}
          size="small"
          onClick={action.onClick as ButtonProps['onClick']}
        >
          {action.label}
        </Button>
      )
    ) : (
      action
    );

    const closeNode = isClosable && (
      <button
        {...closeButtonProps}
        aria-label={closeButtonProps['aria-label'] ?? 'Close alert'}
        disabled={closeDisabled}
        {...styleProps(
          [focusRing.info, styles.close],
          clsx(alertClasses('close'), classNames?.close, closeClassName),
          { ...customStyles?.close, ...closeStyle },
        )}
        type="button"
        onClick={handleClose}
      >
        {configuredCloseIcon ?? closeIcon ?? closeText ?? <X size={14} />}
      </button>
    );

    if (isA2ui) {
      // Adapted from CopilotKit a2ui-playground (MIT): `renderers/feedback.tsx` Alert / Callout.
      const isCallout = variant === 'a2ui-callout';
      const hasTitle = resolvedTitle !== undefined && resolvedTitle !== null;
      return (
        <div
          {...rest}
          data-alert-type={type}
          data-alert-variant={variant}
          ref={ref}
          role={role}
          {...styleProps(
            isCallout
              ? [a2uiStyles.base, a2uiAlertStyles.callout]
              : [a2uiStyles.base, a2uiAlertStyles.alert, a2uiAlertTone[type]],
            clsx(alertClasses(), classNames?.root, classNames?.alert, rootClassName, className),
            { ...style, ...customStyles?.root, ...customStyles?.alert },
          )}
        >
          {showIcon && (
            <span
              aria-hidden="true"
              {...styleProps(
                isCallout
                  ? [a2uiAlertStyles.calloutIcon]
                  : [a2uiAlertStyles.alertIcon, a2uiAlertIconTone[type]],
                clsx(alertClasses('icon'), classNames?.icon),
                customStyles?.icon,
              )}
            >
              <Icon
                icon={icon ?? (isCallout ? Lightbulb : a2uiTypeIcons[type])}
                size={16}
                {...iconProps}
              />
            </span>
          )}
          <div
            {...styleProps(
              [isCallout ? a2uiAlertStyles.calloutContent : a2uiAlertStyles.alertContent],
              clsx(alertClasses('content'), classNames?.section, classNames?.content),
              { ...customStyles?.section, ...customStyles?.content },
            )}
          >
            {hasTitle && (
              <p
                {...styleProps(
                  [isCallout ? a2uiAlertStyles.calloutTitle : a2uiAlertStyles.title],
                  clsx(alertClasses('title'), classNames?.title),
                  customStyles?.title,
                )}
              >
                {resolvedTitle}
              </p>
            )}
            {hasDescription && (
              <p
                {...styleProps(
                  [isCallout ? a2uiAlertStyles.calloutText : a2uiAlertStyles.message],
                  clsx(alertClasses('description'), classNames?.description),
                  customStyles?.description,
                )}
              >
                {description}
              </p>
            )}
          </div>
          {actionNode && (
            <div
              {...styleProps(
                [a2uiAlertStyles.action],
                clsx(alertClasses('action'), classNames?.action),
                customStyles?.action,
              )}
            >
              {actionNode}
            </div>
          )}
          {closeNode}
        </div>
      );
    }

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
          clsx(alertClasses(), classNames?.root, classNames?.alert, rootClassName, className),
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
            {...styleProps(
              [styles.icon],
              clsx(alertClasses('icon'), classNames?.icon),
              customStyles?.icon,
            )}
          >
            <Icon icon={icon ?? typeIcons[type]} size={hasDescription ? 18 : 16} {...iconProps} />
          </span>
        )}
        <div
          {...styleProps(
            [styles.content],
            clsx(alertClasses('content'), classNames?.section, classNames?.content),
            {
              ...customStyles?.section,
              ...customStyles?.content,
            },
          )}
        >
          {resolvedTitle !== undefined && resolvedTitle !== null && (
            <div
              {...styleProps(
                [styles.title, hasDescription && styles.titleDetailed],
                clsx(alertClasses('title'), classNames?.title),
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
                clsx(alertClasses('description'), classNames?.description),
                customStyles?.description,
              )}
            >
              {description}
            </div>
          )}
        </div>
        {actionNode && (
          <div
            {...styleProps(
              [styles.action, styles.wrappedAction],
              clsx(alertClasses('action'), classNames?.action),
              customStyles?.action,
            )}
          >
            {actionNode}
          </div>
        )}
        {closeNode}
      </div>
    );

    if (!extra) return root;

    if (extraIsolate) {
      return (
        <div
          {...styleProps(
            [styles.container, toneStyles[type]],
            clsx(alertClasses('container'), classNames?.container),
            {
              gap: 8,
              ...customStyles?.container,
            },
          )}
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
          clsx(alertClasses('container'), classNames?.container),
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
            clsx(alertClasses('extra'), classNames?.extra),
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
                clsx(
                  'lobe-alert-extra-header',
                  alertClasses('extra-header'),
                  classNames?.extraHeader,
                ),
                customStyles?.extraHeader,
              )}
            >
              <ChevronRight
                aria-hidden="true"
                size={14}
                {...styleProps(
                  [styles.extraIndicator],
                  clsx(alertClasses('extra-indicator'), classNames?.extraIndicator),
                  customStyles?.extraIndicator,
                )}
              />
              <span>{text?.detail ?? 'Show Details'}</span>
            </summary>
            <div
              {...styleProps(
                [styles.extraContent],
                clsx(alertClasses('extra-content'), classNames?.extraContent),
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
