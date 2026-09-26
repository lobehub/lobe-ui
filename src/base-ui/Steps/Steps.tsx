'use client';

import { cx } from 'antd-style';
import { Check } from 'lucide-react';
import { memo, type ReactNode } from 'react';

import Icon from '@/Icon';

import { styles } from './style';
import type { StepItem, StepsProps, StepStatus } from './type';

const getStatus = (
  index: number,
  current: number | undefined,
  item: StepItem,
): StepStatus | undefined => {
  if (item.status) return item.status;
  if (current === undefined) return undefined;
  if (index < current) return 'finish';
  if (index === current) return 'process';
  return 'wait';
};

const renderIndicator = (
  item: StepItem,
  index: number,
  status: StepStatus | undefined,
  isDot: boolean,
): ReactNode => {
  if (isDot) return null;
  if (item.icon != null) return item.icon;
  if (status === 'finish') return <Icon icon={Check} size={12} />;
  return index + 1;
};

const Steps = memo<StepsProps>(
  ({
    className,
    classNames,
    current,
    items,
    orientation = 'horizontal',
    ref,
    styles: customStyles,
    variant = 'default',
    ...rest
  }) => {
    const isDot = variant === 'dot';

    return (
      <ol
        ref={ref}
        className={cx(
          styles.root,
          orientation === 'vertical' ? styles.vertical : styles.horizontal,
          isDot && styles.dot,
          className,
        )}
        {...rest}
      >
        {items.map((item, index) => {
          const status = getStatus(index, current, item);
          const isLast = index === items.length - 1;

          return (
            <li
              aria-current={current !== undefined && index === current ? 'step' : undefined}
              className={cx(classNames?.item)}
              data-status={status ?? 'guide'}
              key={item.key ?? index}
              style={customStyles?.item}
            >
              <span
                className={cx(styles.indicator, classNames?.indicator)}
                style={customStyles?.indicator}
              >
                {renderIndicator(item, index, status, isDot)}
              </span>
              {(item.title != null || item.description != null) && (
                <div className={styles.body}>
                  {item.title != null && (
                    <div
                      className={cx(styles.title, classNames?.title)}
                      style={customStyles?.title}
                    >
                      {item.title}
                    </div>
                  )}
                  {item.description != null && (
                    <div
                      className={cx(styles.description, classNames?.description)}
                      style={customStyles?.description}
                    >
                      {item.description}
                    </div>
                  )}
                </div>
              )}
              {!isLast && (
                <span
                  aria-hidden="true"
                  className={styles.connector}
                  style={isDot ? { insetBlockStart: 20, insetInlineStart: 3 } : undefined}
                />
              )}
            </li>
          );
        })}
      </ol>
    );
  },
);

Steps.displayName = 'Steps';

export default Steps;
