'use client';

import clsx from 'clsx';
import { RotateCw } from 'lucide-react';
import { memo, useMemo } from 'react';
import { encode } from 'uqr';

import qrCodeMessages from '@/i18n/resources/en/qrCode';
import { useTranslation } from '@/i18n/useTranslation';
import Icon from '@/Icon';
import Spin from '@/Spin';
import { focusRing } from '@/styles/stylex/focusRing';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { buildQrPath } from './qrPath';
import { qrCodeClasses } from './stable';
import { styles } from './style';
import type { QRCodeProps } from './type';

const ICON_RATIO = 0.22;

const QRCode = memo<QRCodeProps>(
  ({
    bgColor,
    bordered = true,
    className,
    color = '#000',
    errorLevel = 'M',
    icon,
    onRefresh,
    ref,
    size: sizeProp,
    status = 'active',
    style,
    value,
    ...rest
  }) => {
    const { t } = useTranslation(qrCodeMessages);
    const size = sizeProp ?? 160;
    const { count, path } = useMemo(() => {
      try {
        const { data } = encode(value, { border: 0, ecc: icon ? 'H' : errorLevel });
        const hole = icon ? Math.ceil(data.length * ICON_RATIO) | 1 : 0;
        return { count: data.length, path: buildQrPath(data, hole) };
      } catch {
        return { count: 0, path: '' };
      }
    }, [value, icon, errorLevel]);

    return (
      <div
        ref={ref}
        {...styleProps(
          [styles.root, bordered && styles.bordered],
          clsx(qrCodeClasses(), className),
          bgColor === undefined ? style : { background: bgColor, ...style },
        )}
        {...toDataAttributes({ bordered, status })}
        {...rest}
      >
        <svg
          aria-label={value}
          className={qrCodeClasses('code')}
          height={size}
          role="img"
          shapeRendering="crispEdges"
          viewBox={`0 0 ${count} ${count}`}
          width={size}
        >
          <rect fill={bgColor ?? '#fff'} height={count} width={count} />
          <path d={path} fill={color} />
        </svg>
        {icon && (
          <span
            {...styleProps(
              [styles.icon, sizeProp === undefined && styles.iconDefaultSize],
              qrCodeClasses('icon'),
              sizeProp === undefined
                ? undefined
                : { height: size * ICON_RATIO, width: size * ICON_RATIO },
            )}
          >
            {icon}
          </span>
        )}
        {status === 'loading' && (
          <span
            aria-label={t('qrCode.loading')}
            {...styleProps(styles.overlay, qrCodeClasses('overlay'))}
            role="status"
          >
            <Spin className={styleProps(styles.spin).className} />
          </span>
        )}
        {status === 'expired' && (
          <span {...styleProps(styles.overlay, qrCodeClasses('overlay'))}>
            <span {...styleProps(styles.overlayTitle, qrCodeClasses('title'))}>
              {t('qrCode.expired')}
            </span>
            {onRefresh && (
              <button
                {...styleProps([focusRing.info, styles.refresh], qrCodeClasses('refresh'))}
                type="button"
                onClick={onRefresh}
              >
                <Icon icon={RotateCw} size={14} />
                {t('qrCode.refresh')}
              </button>
            )}
          </span>
        )}
      </div>
    );
  },
);

QRCode.displayName = 'QRCode';

export default QRCode;
