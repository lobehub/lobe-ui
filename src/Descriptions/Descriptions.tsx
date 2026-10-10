'use client';

import * as stylex from '@stylexjs/stylex';
import { Fragment, memo } from 'react';

import { styleProps } from '@/styles/stylex/props';

import { styles } from './style';
import type { DescriptionsProps } from './type';

const Descriptions = memo<DescriptionsProps>(
  ({
    bordered = false,
    className,
    classNames,
    colon = true,
    column = 1,
    extra,
    items,
    ref,
    styles: customStyles,
    style,
    title,
    ...rest
  }) => {
    const columnCount = Math.max(1, Math.floor(column));

    let cursor = 0;
    const placements = items.map((item) => {
      const span = Math.min(Math.max(Math.floor(item.span ?? 1), 1), columnCount);
      if (cursor + span > columnCount) cursor = 0;
      const start = cursor;
      cursor = (cursor + span) % columnCount;
      return { span, start };
    });

    return (
      <div ref={ref} {...rest} {...styleProps(styles.root, className, style)}>
        {(title != null || extra != null) && (
          <div {...stylex.props(styles.header)}>
            <div {...stylex.props(styles.title)}>{title}</div>
            {extra != null && <div {...stylex.props(styles.extra)}>{extra}</div>}
          </div>
        )}
        <dl
          {...stylex.props(styles.list, bordered && styles.bordered)}
          style={{ gridTemplateColumns: `repeat(${columnCount}, auto minmax(0, 1fr))` }}
        >
          {items.map((item, index) => {
            const { span, start } = placements[index];
            const contentStart = String(start * 2 + 2);

            return (
              <Fragment key={item.key ?? index}>
                <dt
                  {...styleProps(
                    [styles.label, bordered && [styles.borderedCell, styles.borderedLabel]],
                    classNames?.label,
                    { gridColumn: String(start * 2 + 1), ...customStyles?.label },
                  )}
                >
                  {item.label}
                  {colon && item.label != null ? ':' : null}
                </dt>
                <dd
                  {...styleProps(
                    [styles.content, bordered && styles.borderedCell],
                    classNames?.content,
                    {
                      gridColumn:
                        span > 1 ? `${contentStart} / span ${span * 2 - 1}` : contentStart,
                      ...customStyles?.content,
                    },
                  )}
                >
                  {item.children}
                </dd>
              </Fragment>
            );
          })}
        </dl>
      </div>
    );
  },
);

Descriptions.displayName = 'Descriptions';

export default Descriptions;
