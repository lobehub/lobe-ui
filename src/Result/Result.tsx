'use client';

import './style.css';

import clsx from 'clsx';
import { Check, Info, TriangleAlert, X } from 'lucide-react';
import { memo } from 'react';

import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { resultClasses } from './stable';
import { styles } from './style';
import type { ResultProps } from './type';

const statusIcon = {
  error: <X size={36} strokeWidth={2.5} />,
  info: <Info size={36} strokeWidth={2} />,
  success: <Check size={36} strokeWidth={2.5} />,
  warning: <TriangleAlert size={36} strokeWidth={2} />,
};

const iconStatusStyles = {
  error: styles.iconError,
  info: styles.iconInfo,
  success: styles.iconSuccess,
  warning: styles.iconWarning,
};

const Result = memo<ResultProps>(
  ({ children, className, extra, icon, ref, status = 'info', style, subTitle, title, ...rest }) => {
    return (
      <section
        ref={ref}
        {...styleProps(styles.root, clsx(resultClasses(), className), style)}
        {...toDataAttributes({ status })}
        {...rest}
      >
        {icon ? (
          <div {...styleProps(styles.customIcon, resultClasses('icon'))}>{icon}</div>
        ) : (
          <div {...styleProps([styles.icon, iconStatusStyles[status]], resultClasses('icon'))}>
            {statusIcon[status]}
          </div>
        )}
        {title && <h3 {...styleProps(styles.title, resultClasses('title'))}>{title}</h3>}
        {subTitle && <p {...styleProps(styles.subTitle, resultClasses('sub-title'))}>{subTitle}</p>}
        {extra && (
          <div {...styleProps(styles.extra, clsx('lobe-result-extra', resultClasses('extra')))}>
            {extra}
          </div>
        )}
        {children}
      </section>
    );
  },
);

Result.displayName = 'Result';

export default Result;
