'use client';

import { Toast as BaseToast } from '@base-ui/react/toast';
import clsx from 'clsx';
import { AlertTriangle, CheckCircle, Info, Loader2, X, XCircle } from 'lucide-react';
import { memo, type ReactNode } from 'react';

import Icon from '@/Icon';
import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { focusRing } from '@/styles/stylex/focusRing';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { useToastContext } from './context';
import { toastClasses } from './stable';
import { actionVariantStyles, rootPositionStyles, styles } from './style';
import { type ToastOptions, type ToastProps, type ToastType } from './type';

const typeIcons: Record<ToastType, typeof Info> = {
  default: Info,
  error: XCircle,
  info: Info,
  loading: Loader2,
  success: CheckCircle,
  warning: AlertTriangle,
};

const typeColors: Record<ToastType, string> = {
  default: cssVar.colorText,
  error: cssVar.colorError,
  info: cssVar.colorInfo,
  loading: cssVar.colorPrimary,
  success: cssVar.colorSuccess,
  warning: cssVar.colorWarning,
};

const ToastItem = memo<ToastProps>(({ toast, classNames, styles: customStyles }) => {
  const { position, swipeDirection } = useToastContext();
  const toastData = toast.data as ToastOptions | undefined;
  const type = toastData?.type ?? 'default';
  const closable = toastData?.closable ?? true;
  const hideCloseButton = toastData?.hideCloseButton ?? false;
  const showCloseButton = closable && !hideCloseButton;
  const icon = toastData?.icon;
  const title = toast.title ?? toastData?.title;
  const description = toast.description ?? toastData?.description;
  const actionProps = toast.actionProps ?? toastData?.actionProps;
  const actions = toastData?.actions;

  const iconColor = typeColors[type];
  const IconComponent = icon ?? typeIcons[type];
  const isLoading = type === 'loading';

  const renderIcon = (): ReactNode => {
    if (!IconComponent) return null;
    return (
      <div
        {...styleProps(
          styles.icon,
          clsx(toastClasses('icon'), classNames?.icon),
          customStyles?.icon,
        )}
      >
        <Icon color={iconColor} icon={IconComponent} size={18} spin={isLoading} />
      </div>
    );
  };

  const renderActions = (): ReactNode => {
    if (actions && actions.length > 0) {
      return (
        <div
          {...styleProps(
            styles.actions,
            clsx(toastClasses('actions'), classNames?.actions),
            customStyles?.actions,
          )}
        >
          {actions.map((action, index) => (
            <BaseToast.Action
              key={index}
              {...styleProps(
                [styles.action, focusRing.info, actionVariantStyles[action.variant ?? 'primary']],
                clsx(toastClasses('action'), classNames?.action),
                customStyles?.action,
              )}
              onClick={action.onClick}
              {...action.props}
            >
              {action.label}
            </BaseToast.Action>
          ))}
        </div>
      );
    }
    if (actionProps) {
      return (
        <BaseToast.Action
          {...styleProps(
            [styles.action, focusRing.info, styles.actionPrimary],
            clsx(toastClasses('action'), classNames?.action),
            customStyles?.action,
          )}
          {...actionProps}
        />
      );
    }
    return null;
  };

  return (
    <BaseToast.Root
      swipeDirection={swipeDirection}
      toast={toast}
      {...toDataAttributes({ position, type })}
      {...styleProps(
        [styles.root, rootPositionStyles[position]],
        clsx(toastClasses(), classNames?.root),
        {
          ...customStyles?.root,
          ...toastData?.style,
        },
      )}
    >
      <BaseToast.Content
        {...styleProps(
          styles.content,
          clsx(toastClasses('content'), classNames?.content),
          customStyles?.content,
        )}
      >
        <div {...styleProps(styles.toastBody, toastClasses('body'))}>
          {renderIcon()}
          <div {...styleProps(styles.contentArea, toastClasses('main'))}>
            {title ? (
              <>
                <div {...styleProps(styles.titleRow, toastClasses('title-row'))}>
                  <BaseToast.Title
                    {...styleProps(
                      styles.title,
                      clsx(toastClasses('title'), classNames?.title),
                      customStyles?.title,
                    )}
                  >
                    {title}
                  </BaseToast.Title>
                  {showCloseButton && (
                    <BaseToast.Close
                      aria-label="Close"
                      {...styleProps(
                        styles.close,
                        clsx(toastClasses('close'), classNames?.close),
                        customStyles?.close,
                      )}
                    >
                      <X size={14} />
                    </BaseToast.Close>
                  )}
                </div>
                {description && (
                  <BaseToast.Description
                    {...styleProps(
                      [styles.description, styles.descriptionWithTitle],
                      clsx(toastClasses('description'), classNames?.description),
                      customStyles?.description,
                    )}
                  >
                    {description}
                  </BaseToast.Description>
                )}
              </>
            ) : (
              description && (
                <div {...styleProps(styles.titleRow, toastClasses('title-row'))}>
                  <BaseToast.Description
                    {...styleProps(
                      [styles.description, styles.descriptionStandalone],
                      clsx(toastClasses('description'), classNames?.description),
                      customStyles?.description,
                    )}
                  >
                    {description}
                  </BaseToast.Description>
                  {showCloseButton && (
                    <BaseToast.Close
                      aria-label="Close"
                      {...styleProps(
                        styles.close,
                        clsx(toastClasses('close'), classNames?.close),
                        customStyles?.close,
                      )}
                    >
                      <X size={14} />
                    </BaseToast.Close>
                  )}
                </div>
              )
            )}
            {renderActions()}
          </div>
        </div>
      </BaseToast.Content>
    </BaseToast.Root>
  );
});

ToastItem.displayName = 'ToastItem';

export default ToastItem;
