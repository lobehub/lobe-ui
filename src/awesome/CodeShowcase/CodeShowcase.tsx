'use client';

import { cx } from 'antd-style';
import { type CSSProperties, memo, useState } from 'react';

import Segmented from '@/base-ui/Segmented';
import Highlighter from '@/Highlighter';

import { styles } from './style';
import type { CodeShowcaseProps } from './type';

const CodeShowcase = memo<CodeShowcaseProps>(
  ({
    activeKey: controlledKey,
    className,
    defaultActiveKey,
    items,
    minHeight = 300,
    onChange,
    style,
    ...rest
  }) => {
    const [innerKey, setInnerKey] = useState(defaultActiveKey ?? items[0]?.key);
    const activeKey = controlledKey ?? innerKey;
    const active = items.find((item) => item.key === activeKey) ?? items[0];

    if (!active) return null;

    return (
      <div
        className={cx(styles.root, className)}
        style={{ '--code-showcase-min-height': `${minHeight}px`, ...style } as CSSProperties}
        {...rest}
      >
        {items.length > 1 && (
          <Segmented
            className={styles.tabs}
            options={items.map(({ key, label }) => ({ label, value: key }))}
            value={active.key}
            variant={'outlined'}
            onChange={(key) => {
              setInnerKey(key);
              onChange?.(key);
            }}
          />
        )}
        <div className={styles.panes}>
          <Highlighter
            className={styles.code}
            language={active.language ?? 'tsx'}
            variant={'outlined'}
          >
            {active.code}
          </Highlighter>
          <div className={styles.preview}>{active.preview}</div>
        </div>
      </div>
    );
  },
);

CodeShowcase.displayName = 'CodeShowcase';

export default CodeShowcase;
