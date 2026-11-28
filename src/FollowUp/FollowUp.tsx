'use client';

import clsx from 'clsx';
import { memo } from 'react';

import { a2uiStyles } from '@/internal/a2ui/styles';
import { focusRing } from '@/styles/stylex/focusRing';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { followUpClasses } from './stable';
import { styles } from './style';
import type { FollowUpItem, FollowUpProps } from './type';

const toItem = (item: string | FollowUpItem): FollowUpItem =>
  typeof item === 'string' ? { label: item, message: item } : item;

/**
 * Suggested next prompts as pills; a click hands the pill's message to `onFollowUp`. A lobe-ui
 * look by default, the A2UI playground look with `variant="a2ui"`. Adapted from CopilotKit Gen UI
 * 2.0 standard catalog (MIT), `standard/composites.tsx` FollowUp.
 */
const FollowUp = memo<FollowUpProps>(
  ({
    className,
    classNames,
    items,
    onFollowUp,
    ref,
    style,
    styles: customStyles,
    title,
    variant = 'default',
  }) => {
    const isA2ui = variant === 'a2ui';
    if (items.length === 0) return null;
    return (
      <div
        ref={ref}
        {...toDataAttributes({ variant })}
        {...styleProps(
          [isA2ui ? a2uiStyles.base : styles.dRoot, styles.root],
          clsx(followUpClasses(), className, classNames?.root),
          { ...style, ...customStyles?.root },
        )}
      >
        {title != null && (
          <span
            {...styleProps(
              isA2ui ? styles.a2uiTitle : styles.dTitle,
              clsx(followUpClasses('title'), classNames?.title),
              customStyles?.title,
            )}
          >
            {title}
          </span>
        )}
        <div
          {...styleProps(
            styles.items,
            clsx(followUpClasses('items'), classNames?.items),
            customStyles?.items,
          )}
        >
          {items.map((raw, index) => {
            const item = toItem(raw);
            const message =
              item.message ?? (typeof item.label === 'string' ? item.label : String(index));
            return (
              <button
                key={item.key ?? `${message}-${index}`}
                type="button"
                {...styleProps(
                  [focusRing.info, styles.item, isA2ui ? styles.a2uiItem : styles.dItem],
                  clsx(followUpClasses('item'), classNames?.item),
                  customStyles?.item,
                )}
                onClick={(event) => {
                  event.stopPropagation();
                  onFollowUp?.(message, item, index);
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  },
);

FollowUp.displayName = 'FollowUp';

export default FollowUp;
