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
            const span = Math.min(Math.max(Math.floor(item.span ?? 1), 1), columnCount);

            return (
              <Fragment key={item.key ?? index}>
                <dt className={cx(styles.label, classNames?.label)} style={customStyles?.label}>
                  {item.label}
                  {colon && item.label != null ? ':' : null}
                </dt>
                <dd
                  className={cx(styles.content, classNames?.content)}
                  style={{
                    gridColumn: span > 1 ? `span ${span * 2 - 1}` : undefined,
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
