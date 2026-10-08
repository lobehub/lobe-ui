'use client';

import * as stylex from '@stylexjs/stylex';
import { Check } from 'lucide-react';
import { memo, type ReactNode } from 'react';

import Icon from '@/Icon';
import { styleProps } from '@/styles/stylex/props';

import { indicatorStatusStyles, styles, titleStatusStyles } from './style';
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
    const isVertical = orientation === 'vertical';

    return (
      <ol
        ref={ref}
        {...rest}
        {...styleProps(
          [styles.root, isVertical ? styles.vertical : styles.horizontal],
          className,
          rest.style,
        )}
      >
        {items.map((item, index) => {
          const status = getStatus(index, current, item);
          const statusKey = status ?? 'guide';
          const isLast = index === items.length - 1;

          return (
            <li
              aria-current={current !== undefined && index === current ? 'step' : undefined}
              data-status={statusKey}
              key={item.key ?? index}
              {...styleProps(
                isVertical
                  ? [styles.itemVertical, isLast && styles.itemVerticalLast]
                  : [styles.itemHorizontal, isLast && styles.itemHorizontalLast],
                classNames?.item,
                customStyles?.item,
              )}
            >
              <span
                {...styleProps(
                  [
                    styles.indicator,
                    indicatorStatusStyles[statusKey],
                    isDot && styles.dot,
                    isDot &&
                      (statusKey === 'process' || statusKey === 'finish') &&
                      styles.dotActive,
                  ],
                  classNames?.indicator,
                  customStyles?.indicator,
                )}
              >
                {renderIndicator(item, index, status, isDot)}
              </span>
              {(item.title != null || item.description != null) && (
                <div {...stylex.props(styles.body)}>
                  {item.title != null && (
                    <div
                      {...styleProps(
                        [
                          styles.title,
                          titleStatusStyles[statusKey],
                          isVertical && styles.titleVertical,
                        ],
                        classNames?.title,
                        customStyles?.title,
                      )}
                    >
                      {item.title}
                    </div>
                  )}
                  {item.description != null && (
                    <div
                      {...styleProps(
                        styles.description,
                        classNames?.description,
                        customStyles?.description,
                      )}
                    >
                      {item.description}
                    </div>
                  )}
                </div>
              )}
              {!isLast && (
                <span
                  aria-hidden="true"
                  {...styleProps(
                    [
                      styles.connector,
                      statusKey === 'finish' && styles.connectorFinish,
                      isVertical && styles.connectorVertical,
                    ],
                    undefined,
                    isDot ? { insetBlockStart: 20, insetInlineStart: 3 } : undefined,
                  )}
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
