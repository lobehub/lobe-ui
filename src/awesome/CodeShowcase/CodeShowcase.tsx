'use client';

import './style.css';

import clsx from 'clsx';
import { type CSSProperties, memo, useState } from 'react';

import Highlighter from '@/Highlighter';
import Segmented from '@/Segmented';
import { styleProps } from '@/styles/stylex/props';

import { awesomeCodeShowcaseClasses } from './stable';
import { styles } from './style';
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
        {...styleProps(styles.root, clsx(awesomeCodeShowcaseClasses(), className), {
          ...(minHeight === undefined
            ? undefined
            : { '--code-showcase-min-height': `${minHeight}px` }),
          ...style,
        } as CSSProperties)}
        {...rest}
      >
        {items.length > 1 && (
          <Segmented
            className={awesomeCodeShowcaseClasses('tabs')}
            options={items.map(({ key, label }) => ({ label, value: key }))}
            value={active.key}
            variant={'outlined'}
            onChange={(key) => {
              setInnerKey(key);
              onChange?.(key);
            }}
          />
        )}
        <div {...styleProps(styles.panes, awesomeCodeShowcaseClasses('panes'))}>
          <Highlighter
            className={awesomeCodeShowcaseClasses('code')}
            language={active.language ?? 'tsx'}
            variant={'outlined'}
          >
            {active.code}
          </Highlighter>
          <div
            {...styleProps(
              styles.preview,
              clsx(awesomeCodeShowcaseClasses('preview'), 'lobe-code-showcase-preview'),
            )}
          >
            {active.preview}
          </div>
        </div>
      </div>
    );
  },
);

CodeShowcase.displayName = 'CodeShowcase';

export default CodeShowcase;
