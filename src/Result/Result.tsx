'use client';

import './style.css';

import * as stylex from '@stylexjs/stylex';
import { Check, Info, TriangleAlert, X } from 'lucide-react';
import { memo, useMemo } from 'react';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { styleProps } from '@/styles/stylex/props';

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
      <section ref={ref} {...styleProps(styles.root, className, style)} {...rest}>
        {icon ? (
          <div {...stylex.props(styles.customIcon)}>{icon}</div>
        ) : (
          <div {...stylex.props(styles.icon)} style={iconStyle}>
            {statusIcon[status]}
          </div>
        )}
        {title && <h3 {...stylex.props(styles.title)}>{title}</h3>}
        {subTitle && <p {...stylex.props(styles.subTitle)}>{subTitle}</p>}
        {extra && <div {...styleProps(styles.extra, 'lobe-result-extra')}>{extra}</div>}
        {children}
      </section>
    );
  },
);

Result.displayName = 'Result';

export default Result;
