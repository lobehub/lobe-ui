'use client';

import { cx } from 'antd-style';
import { RotateCw } from 'lucide-react';
import { memo, useMemo } from 'react';
import { encode } from 'uqr';

import { panelStyles } from '@/base-ui/panelStyles';
import Spin from '@/base-ui/Spin';
import qrCodeMessages from '@/i18n/resources/en/qrCode';
import { useTranslation } from '@/i18n/useTranslation';
import Icon from '@/Icon';

import { buildQrPath } from './qrPath';
import { styles } from './style';
import type { QRCodeProps } from './type';

const ICON_RATIO = 0.22;

const QRCode = memo<QRCodeProps>(
  ({
    bgColor = '#fff',
    bordered = true,
    className,
    color = '#000',
    errorLevel = 'M',
    icon,
    onRefresh,
    ref,
    size = 160,
    status = 'active',
    style,
    value,
    ...rest
  }) => {
    const { t } = useTranslation(qrCodeMessages);
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
        className={cx(styles.root, bordered && styles.bordered, className)}
        ref={ref}
        style={{ background: bgColor, ...style }}
        {...rest}
      >
        <svg
          aria-label={value}
          height={size}
          role="img"
          shapeRendering="crispEdges"
          viewBox={`0 0 ${count} ${count}`}
          width={size}
        >
          <rect fill={bgColor} height={count} width={count} />
          <path d={path} fill={color} />
        </svg>
        {icon && (
          <span
            className={styles.icon}
            style={{ height: size * ICON_RATIO, width: size * ICON_RATIO }}
          >
            {icon}
          </span>
        )}
        {status === 'loading' && (
          <span aria-label={t('qrCode.loading')} className={styles.overlay} role="status">
            <Spin style={{ color: '#666' }} />
          </span>
        )}
        {status === 'expired' && (
          <span className={styles.overlay}>
            <span className={styles.overlayTitle}>{t('qrCode.expired')}</span>
            {onRefresh && (
              <button
                className={panelStyles.pill}
                style={{ background: '#080808', color: '#fff' }}
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
