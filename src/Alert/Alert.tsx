'use client';

import { Alert as AntdAlert, message } from 'antd';
import { cva } from 'class-variance-authority';
import { camelCase } from 'lodash-es';
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Info,
  X,
  XCircle,
} from 'lucide-react';
import { memo, useMemo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import ActionIcon from '@/ActionIcon';
import Icon from '@/Icon';

import { useStyles } from './style';
import type { AlertProps } from './type';

const typeIcons = {
  error: XCircle,
  info: Info,
  secondary: AlertTriangle,
  success: CheckCircle,
  warning: AlertTriangle,
};

const colors = (theme: any, type: string = 'info', ...keys: string[]) => {
  if (type === 'secondary') return theme[camelCase(['color', ...keys].join('-'))] as string;
  return theme[camelCase(['color', type, ...keys].join('-'))] as string;
};

const Alert = memo<AlertProps>(
  ({
    closeIcon,
    closable = false,
    description,
    showIcon = true,
    type = 'info',
    glass,
    icon,
    colorfulText = true,
    iconProps,
    style,
    extra,
    classNames,
    text,
    extraDefaultExpand = false,
    extraIsolate,
    banner,
    variant = 'filled',
    ref,
    ...rest
  }) => {
    const [expand, setExpand] = useState(extraDefaultExpand);
    const { theme, styles, cx } = useStyles({
      closable: !!closable,
      hasTitle: !!description,
      showIcon: !!showIcon,
    });

    const variants = useMemo(
      () =>
        cva(styles.root, {
          defaultVariants: {
            colorfulText: true,
            glass: false,
            variant: 'filled',
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            variant: {
              filled: styles.filled,
              outlined: styles.outlined,
              borderless: styles.borderless,
            },
            glass: {
              false: null,
              true: styles.glass,
            },
            colorfulText: {
              false: null,
              true: styles.colorfulText,
            },
            hasExtra: {
              false: null,
              true: styles.hasExtra,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    const extraVariants = useMemo(
      () =>
        cva(styles.extra, {
          defaultVariants: {
            variant: 'filled',
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            variant: {
              filled: styles.filled,
              outlined: styles.outlined,
              borderless: styles.borderless,
            },
            banner: {
              false: null,
              true: styles.banner,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    const extraHeaderVariants = useMemo(
      () =>
        cva(styles.extraHeader, {
          defaultVariants: {
            variant: 'filled',
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            variant: {
              filled: null,
              outlined: null,
              borderless: styles.borderlessExtraHeader,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    const extraBodyVariants = useMemo(
      () =>
        cva(styles.extraBody, {
          defaultVariants: {
            variant: 'filled',
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            variant: {
              filled: null,
              outlined: null,
              borderless: styles.borderless,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    const isInsideExtra = Boolean(!extraIsolate && !!extra);

    const alert = (
      <AntdAlert
        banner={banner}
        className={cx(
          variants({
            colorfulText,
            glass,
            hasExtra: isInsideExtra,
            variant,
          }),
          classNames?.alert,
        )}
        closable={closable}
        closeIcon={closeIcon || <ActionIcon color={colors(theme, type)} icon={X} size={'small'} />}
        description={description}
        icon={
          <Icon
            color={type === 'secondary' ? theme.colorTextSecondary : undefined}
            icon={typeIcons[type] || icon}
            size={description ? 24 : 18}
            {...iconProps}
          />
        }
        ref={ref}
        showIcon={showIcon}
        style={{
          background: colors(theme, type, 'fillTertiary'),
          borderColor: colors(theme, type, 'fillSecondary'),
          color: colorfulText ? colors(theme, type) : undefined,
          ...style,
        }}
        type={type === 'secondary' ? 'info' : type}
        {...rest}
      />
    );

    if (!extra) return alert;

    if (extraIsolate)
      return (
        <Flexbox className={classNames?.container} gap={8}>
          {alert}
          {extra}
        </Flexbox>
      );

    return (
      <Flexbox className={classNames?.container}>
        {alert}
        <Flexbox
          className={extraVariants({ banner, variant })}
          style={{
            background: colors(theme, type, 'fillTertiary'),
            borderColor: colors(theme, type, 'fillSecondary'),
            color: colors(theme, type),
            fontSize: description ? 14 : 12,
          }}
        >
          <Flexbox
            align={'center'}
            className={extraHeaderVariants({ variant })}
            gap={message ? 6 : 10}
            horizontal
            style={{
              borderColor: colors(theme, type, 'fillSecondary'),
            }}
          >
            <ActionIcon
              color={colors(theme, type)}
              icon={expand ? ChevronDown : ChevronRight}
              onClick={() => setExpand(!expand)}
              size={18}
            />
            <div className={cx(styles.expandText)} onClick={() => setExpand(!expand)}>
              {text?.detail || 'Show Details'}
            </div>
          </Flexbox>
          {expand && <div className={extraBodyVariants({ variant })}>{extra}</div>}
        </Flexbox>
      </Flexbox>
    );
  },
);

Alert.displayName = 'Alert';

export default Alert;
