'use client';

import clsx from 'clsx';

import { a2uiStyles } from '@/internal/a2ui/styles';
import { formatA2uiNumber } from '@/internal/a2ui/utils';
import { styleProps } from '@/styles/stylex/props';

import { styles } from './a2uiStyle';
import { descriptionsClasses } from './stable';
import type { DescriptionsProps } from './type';

/**
 * `variant="a2ui"`: the A2UI playground `KeyValueList`, a card of label / value rows split by
 * dashed hairlines, values right-aligned with an optional hint under them.
 * Adapted from CopilotKit a2ui-playground (MIT), renderers/data.tsx.
 */
const A2uiDescriptions = ({
  bordered: _bordered,
  className,
  classNames,
  colon: _colon,
  column = 1,
  extra,
  items,
  ref,
  style,
  styles: customStyles,
  title,
  variant: _variant,
  ...rest
}: DescriptionsProps) => {
  const cols = Math.min(3, Math.max(1, Math.round(column)));
  return (
    <div
      data-variant="a2ui"
      ref={ref}
      {...rest}
      {...styleProps(
        [a2uiStyles.base, a2uiStyles.card, styles.card],
        clsx(descriptionsClasses(), className),
        style,
      )}
    >
      {(title != null || extra != null) && (
        <div {...styleProps(styles.header, descriptionsClasses('header'))}>
          {title != null ? (
            <h3 {...styleProps(a2uiStyles.title, descriptionsClasses('title'))}>{title}</h3>
          ) : (
            <span />
          )}
          {extra != null && <div className={descriptionsClasses('extra')}>{extra}</div>}
        </div>
      )}
      <dl
        {...styleProps(
          [styles.list, cols === 2 && styles.cols2, cols === 3 && styles.cols3],
          descriptionsClasses('list'),
        )}
      >
        {items.map((item, index) => (
          <div key={item.key ?? index} {...styleProps(styles.row, descriptionsClasses('item'))}>
            <dt
              {...styleProps(
                styles.label,
                clsx(descriptionsClasses('label'), classNames?.label),
                customStyles?.label,
              )}
            >
              {item.label}
            </dt>
            <dd
              {...styleProps(
                styles.value,
                clsx(descriptionsClasses('content'), classNames?.content),
                customStyles?.content,
              )}
            >
              <span {...styleProps(styles.valueText)}>
                {typeof item.children === 'number'
                  ? formatA2uiNumber(item.children)
                  : item.children}
              </span>
              {item.hint != null && (
                <span {...styleProps(styles.hint, descriptionsClasses('hint'))}>{item.hint}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default A2uiDescriptions;
