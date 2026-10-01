'use client';

import { cx } from 'antd-style';
import { Fragment, memo } from 'react';

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
      <div className={cx(styles.root, className)} ref={ref} {...rest}>
        {(title != null || extra != null) && (
          <div className={styles.header}>
            <div className={styles.title}>{title}</div>
            {extra != null && <div className={styles.extra}>{extra}</div>}
          </div>
        )}
        <dl
          className={cx(styles.list, bordered && styles.bordered)}
          style={{ gridTemplateColumns: `repeat(${columnCount}, auto minmax(0, 1fr))` }}
        >
          {items.map((item, index) => {
            const { span, start } = placements[index];
            const contentStart = String(start * 2 + 2);

            return (
              <Fragment key={item.key ?? index}>
                <dt
                  className={cx(styles.label, classNames?.label)}
                  style={{ gridColumn: String(start * 2 + 1), ...customStyles?.label }}
                >
                  {item.label}
                  {colon && item.label != null ? ':' : null}
                </dt>
                <dd
                  className={cx(styles.content, classNames?.content)}
                  style={{
                    gridColumn: span > 1 ? `${contentStart} / span ${span * 2 - 1}` : contentStart,
                    ...customStyles?.content,
                  }}
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
