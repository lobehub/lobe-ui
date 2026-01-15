'use client';

import { Toast as BaseToast } from '@base-ui/react/toast';
import { cssVar, cx } from 'antd-style';
import { AlertTriangle, CheckCircle, Info, Loader2, X, XCircle } from 'lucide-react';
import { type ReactNode, memo } from 'react';

import Icon from '@/Icon';

import { useToastContext } from './context';
import { rootVariants, styles } from './style';
import type { ToastOptions, ToastProps, ToastType } from './type';

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
  const icon = toastData?.icon;
  const title = toast.title ?? toastData?.title;
  const description = toast.description ?? toastData?.description;
  const actionProps = toast.actionProps ?? toastData?.actionProps;

  const iconColor = typeColors[type];
  const IconComponent = icon ?? typeIcons[type];
  const isLoading = type === 'loading';

  const renderIcon = (): ReactNode => {
    if (!IconComponent) return null;
    return (
      <div className={cx(styles.icon, classNames?.icon)} style={customStyles?.icon}>
        <Icon color={iconColor} icon={IconComponent} size={18} spin={isLoading} />
      </div>
    );
  };

  return (
    <BaseToast.Root
      className={cx(rootVariants({ position }), classNames?.root)}
      style={{
        ...customStyles?.root,
        ...toastData?.style,
      }}
      swipeDirection={swipeDirection}
      toast={toast}
    >
      <BaseToast.Content
        className={cx(styles.content, classNames?.content)}
        style={customStyles?.content}
      >
        <div className={styles.toastBody}>
          {renderIcon()}
          <div style={{ flex: 1, minWidth: 0 }}>
            {title && (
              <BaseToast.Title
                className={cx(styles.title, classNames?.title)}
                style={customStyles?.title}
              >
                {title}
              </BaseToast.Title>
            )}
            {description && (
              <BaseToast.Description
                className={cx(styles.description, classNames?.description)}
                style={{
                  marginBlockStart: title ? 4 : 0,
                  ...customStyles?.description,
                }}
              >
                {description}
              </BaseToast.Description>
            )}
            {actionProps && (
              <BaseToast.Action
                className={cx(styles.action, classNames?.action)}
                style={customStyles?.action}
                {...actionProps}
              />
            )}
          </div>
        </div>
        {closable && (
          <BaseToast.Close
            aria-label="Close"
            className={cx(styles.close, classNames?.close)}
            style={customStyles?.close}
          >
            <X size={14} />
          </BaseToast.Close>
        )}
      </BaseToast.Content>
    </BaseToast.Root>
  );
});

ToastItem.displayName = 'ToastItem';

export default ToastItem;
