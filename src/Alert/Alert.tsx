'use client';

import { Alert as AntdAlert } from 'antd';
import { cssVar, cx, useTheme } from 'antd-style';
import { camelCase } from 'es-toolkit/compat';
import { AlertTriangle, CheckCircle, Info, X, XCircle } from 'lucide-react';
import { memo } from 'react';

import { Accordion, AccordionItem } from '@/Accordion';
import ActionIcon from '@/ActionIcon';
import { Flexbox } from '@/Flex';
import Icon from '@/Icon';

import { extraHeaderVariants, extraVariants, rootVariants } from './style';
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
    const theme = useTheme();
    const hasTitle = !!description;
    const isClosable = !!closable;
    const isShowIcon = !!showIcon;

    const isInsideExtra = Boolean(!extraIsolate && !!extra);

    const alert = (
      <AntdAlert
        banner={banner}
        className={cx(
          rootVariants({
            closable: isClosable,
            colorfulText,
            glass,
            hasExtra: isInsideExtra,
            hasTitle,
            showIcon: isShowIcon,
            variant,
          }),
          classNames?.alert,
        )}
        closable={
          typeof closable === 'boolean'
            ? closable
            : {
                closeIcon: <ActionIcon color={colors(theme, type)} icon={X} size={'small'} />,
                ...closable,
              }
        }
        description={description}
        icon={
          <Icon
            color={type === 'secondary' ? cssVar.colorTextSecondary : undefined}
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
                header: extraHeaderVariants({ hasTitle, variant }),
              }}
              itemKey={'extra'}
              styles={{
                content: {
                  fontSize: 12,
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
