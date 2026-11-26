'use client';

import clsx from 'clsx';
import { Check, X } from 'lucide-react';
import type { ReactNode } from 'react';

import { a2uiStyles } from '@/internal/a2ui/styles';
import { styleProps } from '@/styles/stylex/props';

import { styles } from './a2uiStyle';
import { stepsClasses } from './stable';
import type { StepsProps, StepStatus } from './type';

const markerStyles = {
  error: styles.markerError,
  finish: styles.markerDone,
  process: styles.markerCurrent,
  wait: styles.markerUpcoming,
};

const defaultMarker = (status: StepStatus): ReactNode => {
  if (status === 'finish') return <Check size={12} strokeWidth={2.75} />;
  if (status === 'error') return <X size={12} strokeWidth={2.75} />;
  return <span {...styleProps(status === 'process' ? styles.dotCurrent : styles.dotUpcoming)} />;
};

/**
 * `variant="a2ui"`: the A2UI playground `Timeline`, a card with done / current / upcoming
 * markers, title with its time on the right, and a muted description.
 * Adapted from CopilotKit a2ui-playground (MIT), renderers/data.tsx.
 */
const A2uiSteps = ({
  className,
  classNames,
  current,
  items,
  ref,
  styles: customStyles,
  style,
  orientation: _orientation,
  variant: _variant,
  ...rest
}: StepsProps) => (
  <ol
    data-orientation="vertical"
    data-variant="a2ui"
    ref={ref}
    {...rest}
    {...styleProps(
      [a2uiStyles.base, a2uiStyles.card, styles.card],
      clsx(stepsClasses(), className),
      style,
    )}
  >
    {items.map((item, index) => {
      const status: StepStatus =
        item.status ??
        (current === undefined
          ? 'finish'
          : index < current
            ? 'finish'
            : index === current
              ? 'process'
              : 'wait');
      const isLast = index === items.length - 1;
      return (
        <li
          aria-current={current !== undefined && index === current ? 'step' : undefined}
          data-status={status}
          key={item.key ?? index}
          {...styleProps(
            styles.item,
            clsx(stepsClasses('item'), classNames?.item),
            customStyles?.item,
          )}
        >
          <div {...styleProps(styles.rail)}>
            {!isLast && (
              <span
                aria-hidden="true"
                {...styleProps(
                  [styles.railLine, status === 'finish' && styles.railLineDone],
                  stepsClasses('connector'),
                )}
              />
            )}
            <span
              {...styleProps(
                [styles.marker, markerStyles[status]],
                clsx(stepsClasses('indicator'), classNames?.indicator),
                customStyles?.indicator,
              )}
            >
              {item.icon ?? defaultMarker(status)}
            </span>
          </div>
          <div {...styleProps([styles.body, !isLast && styles.bodyGap], stepsClasses('body'))}>
            <div {...styleProps(styles.head)}>
              <span
                {...styleProps(
                  [styles.title, status === 'wait' && styles.titleUpcoming],
                  clsx(stepsClasses('title'), classNames?.title),
                  customStyles?.title,
                )}
              >
                {item.title}
              </span>
              {item.time != null && (
                <span {...styleProps(styles.time, stepsClasses('time'))}>{item.time}</span>
              )}
            </div>
            {item.description != null && (
              <p
                {...styleProps(
                  styles.description,
                  clsx(stepsClasses('description'), classNames?.description),
                  customStyles?.description,
                )}
              >
                {item.description}
              </p>
            )}
          </div>
        </li>
      );
    })}
  </ol>
);

export default A2uiSteps;
