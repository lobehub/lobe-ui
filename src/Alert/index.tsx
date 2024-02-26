import { type AlertProps as AntAlertProps, Alert as AntdAlert, message } from 'antd';
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
import { type ReactNode, memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import ActionIcon from '@/ActionIcon';
import Icon from '@/Icon';

import { useStyles } from './style';

export interface AlertProps extends AntAlertProps {
  classNames?: {
    alert?: string;
    container?: string;
  };
  colorfulText?: boolean;
  extra?: ReactNode;
  extraDefaultExpand?: boolean;
  extraIsolate?: boolean;
  text?: {
    detail?: string;
  };
  variant?: 'default' | 'block' | 'ghost' | 'pure';
}

const typeIcons = {
  error: XCircle,
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
};

const colors = (theme: any, type: string = 'info', ...keys: string[]) =>
  theme[camelCase(['color', type, ...keys].join('-'))] as string;

const Alert = memo<AlertProps>(
  ({
    closeIcon,
    closable = false,
    description,
    showIcon = true,
    type = 'info',
    variant,
    icon,
    colorfulText = true,
    style,
    extra,
    classNames,
    text,
    extraDefaultExpand = false,
    extraIsolate,
    banner,
    ...rest
  }) => {
    const [expand, setExpand] = useState(extraDefaultExpand);
    const { theme, styles, cx } = useStyles({
      closable: !!closable,
      hasTitle: !!description,
      showIcon: !!showIcon,
    });

    const isInsideExtra = !extraIsolate && !!extra;

    const alert = (
      <AntdAlert
        banner={banner}
        className={cx(
          styles.container,
          colorfulText && styles.colorfulText,
          !!isInsideExtra && styles.hasExtra,
          variant === 'block' && styles.variantBlock,
          variant === 'ghost' && styles.variantGhost,
          variant === 'pure' && styles.variantPure,
          classNames?.alert,
          !isInsideExtra && styles.container,
        )}
        closable={closable}
        closeIcon={closeIcon || <ActionIcon color={colors(theme, type)} icon={X} size={'small'} />}
        description={description}
        icon={<Icon icon={typeIcons[type] || icon} size={{ fontSize: description ? 24 : 18 }} />}
        showIcon={showIcon}
        style={{ color: colorfulText ? colors(theme, type) : undefined, ...style }}
        type={type}
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
          className={cx(
            styles.extra,
            banner && styles.banner,
            variant === 'block' && styles.variantBlock,
            variant === 'ghost' && styles.variantGhost,
            variant === 'pure' && styles.variantPure,
          )}
          style={{
            background: colors(theme, type, 'bg'),
            borderColor: colors(theme, type, 'border'),
            color: colors(theme, type),
            fontSize: description ? 14 : 12,
          }}
        >
          <Flexbox
            align={'center'}
            className={cx(styles.extraHeader, variant === 'pure' && styles.variantPureExtraHeader)}
            gap={message ? 6 : 10}
            horizontal
            style={{
              borderColor: colors(theme, type, 'border'),
            }}
          >
            <ActionIcon
              color={colorfulText ? colors(theme, type) : undefined}
              icon={expand ? ChevronDown : ChevronRight}
              onClick={() => setExpand(!expand)}
              size={{ blockSize: 24, fontSize: 18 }}
            />
            <div className={cx(styles.expandText)} onClick={() => setExpand(!expand)}>
              {text?.detail || 'Show Details'}
            </div>
          </Flexbox>
          {expand && (
            <div className={cx(styles.extraBody, variant === 'pure' && styles.variantPure)}>
              {extra}
            </div>
          )}
        </Flexbox>
      </Flexbox>
    );
  },
);

export default Alert;
