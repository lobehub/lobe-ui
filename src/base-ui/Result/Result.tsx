'use client';

import { cssVar, cx } from 'antd-style';
import { Check, Info, TriangleAlert, X } from 'lucide-react';
import { memo, useMemo } from 'react';

import { statusColor, styles } from './style';
import type { ResultProps } from './type';

const statusIcon = {
  error: <X size={36} strokeWidth={2.5} />,
  info: <Info size={36} strokeWidth={2} />,
  success: <Check size={36} strokeWidth={2.5} />,
  warning: <TriangleAlert size={36} strokeWidth={2} />,
};

const Result = memo<ResultProps>(
  ({ children, className, extra, icon, ref, status = 'info', style, subTitle, title, ...rest }) => {
    const iconStyle = useMemo(() => {
      if (status === 'info') {
        return { background: cssVar.colorFillTertiary, color: cssVar.colorTextSecondary };
      }
      const color = statusColor[status];
      return { background: `color-mix(in srgb, ${color} 12%, transparent)`, color };
    }, [status]);

    return (
      <section className={cx(styles.root, className)} ref={ref} style={style} {...rest}>
        <div className={styles.icon} style={iconStyle}>
          {icon ?? statusIcon[status]}
        </div>
        {title && <h3 className={styles.title}>{title}</h3>}
        {subTitle && <p className={styles.subTitle}>{subTitle}</p>}
        {extra && <div className={styles.extra}>{extra}</div>}
        {children}
      </section>
    );
  },
);

Result.displayName = 'Result';

export default Result;
