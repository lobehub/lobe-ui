'use client';

import { Alert as AntdAlert } from 'antd';
import { cva } from 'class-variance-authority';
import { camelCase } from 'lodash-es';
import { AlertTriangle, CheckCircle, Info, X, XCircle } from 'lucide-react';
import { memo, useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { Accordion, AccordionItem } from '@/Accordion';
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
    styles: customStyles,
    text,
    extraDefaultExpand = false,
    extraIsolate,
    banner,
    variant = 'filled',
    ref,
    ...rest
  }) => {
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
          ...customStyles?.alert,
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
      <Flexbox className={classNames?.container} style={customStyles?.container}>
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
          <Accordion defaultExpandedKeys={extraDefaultExpand ? ['extra'] : []}>
            <AccordionItem
              classNames={{
                content: classNames?.extraContent,
                header: extraHeaderVariants({ variant }),
              }}
              itemKey={'extra'}
              styles={{
                content: {
                  fontSize: 12,
                  padding: 8,
                  ...customStyles?.extraContent,
                },
                header: {
                  borderColor: colors(theme, type, 'fillSecondary'),
                },
                indicator: {
                  color: colors(theme, type),
                },
                title: {
                  color: colors(theme, type),
                  fontSize: 12,
                },
              }}
              title={text?.detail || 'Show Details'}
            >
              {extra}
            </AccordionItem>
          </Accordion>
        </Flexbox>
      </Flexbox>
    );
  },
);

Alert.displayName = 'Alert';

export default Alert;
