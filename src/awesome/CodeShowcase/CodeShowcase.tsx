'use client';

import './style.css';

import * as stylex from '@stylexjs/stylex';
import { type CSSProperties, memo, useState } from 'react';

import Highlighter from '@/Highlighter';
import Segmented from '@/Segmented';
import { styleProps } from '@/styles/stylex/props';

import { childStyles, styles } from './style';
import type { CodeShowcaseProps } from './type';

const CodeShowcase = memo<CodeShowcaseProps>(
  ({
    activeKey: controlledKey,
    className,
    defaultActiveKey,
    items,
    minHeight,
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
        {...styleProps(styles.root, className, {
          '--code-showcase-min-height': `${minHeight}px`,
          ...style,
        } as CSSProperties)}
        {...rest}
      >
        {items.length > 1 && (
          <Segmented
            options={items.map(({ key, label }) => ({ label, value: key }))}
            style={childStyles.tabs}
            value={active.key}
            variant={'outlined'}
            onChange={(key) => {
              setInnerKey(key);
              onChange?.(key);
            }}
          />
        )}
        <div {...stylex.props(styles.panes)}>
          <Highlighter
            language={active.language ?? 'tsx'}
            style={childStyles.code}
            variant={'outlined'}
          >
            {active.code}
          </Highlighter>
          <div {...styleProps(styles.preview, 'lobe-code-showcase-preview')}>{active.preview}</div>
        </div>
      </div>
    );
  },
);

CodeShowcase.displayName = 'CodeShowcase';

export default CodeShowcase;
