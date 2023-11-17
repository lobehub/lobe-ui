import { type AlertProps as AntAlertProps, Alert as AntdAlert } from 'antd';
import { camelCase } from 'lodash-es';
import { AlertTriangle, CheckCircle, Info, X, XCircle } from 'lucide-react';
import { memo } from 'react';

import ActionIcon from '@/ActionIcon';
import Icon from '@/Icon';

import { useStyles } from './style';

export interface AlertProps extends AntAlertProps {
  colorfulText?: boolean;
  styleType: 'block' | 'ghost' | 'pure';
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
    closable,
    description,
    showIcon,
    type = 'info',
    styleType,
    icon,
    colorfulText = true,
    style,
    ...rest
  }) => {
    const { theme, styles, cx } = useStyles({
      closable,
      hasTitle: !!description,
      showIcon,
    });

    return (
      <AntdAlert
        className={cx(
          styles.container,
          colorfulText && styles.colorfulText,
          styleType === 'block' && styles.styleBlock,
          styleType === 'ghost' && styles.styleGhost,
          styleType === 'pure' && styles.stylePure,
        )}
        closable={closable}
        closeIcon={closeIcon || <ActionIcon color={colors(theme, type)} icon={X} size={'small'} />}
        description={description}
        icon={<Icon icon={typeIcons[type] || icon} />}
        showIcon={showIcon}
        style={{ color: colors(theme, type), ...style }}
        type={type}
        {...rest}
      />
    );
  },
);

export default Alert;
