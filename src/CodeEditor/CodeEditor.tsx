'use client';

import clsx from 'clsx';
import { memo } from 'react';
import useMergeState from 'use-merge-value';

import { Flexbox } from '@/Flex';
import { SyntaxHighlighterImpl } from '@/Highlighter/SyntaxHighlighter';
import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { styleProps } from '@/styles/stylex/props';

import { styles, variantStyles } from './style';
import type { CodeEditorProps } from './type';

const CodeEditor = memo<CodeEditorProps>(
  ({
    autoFocus,
    classNames,
    styles: customStyles,
    defaultValue = '',
    onChange,
    placeholder = '',
    style,
    className,
    onValueChange,
    value,
    language = 'markdown',
    variant = 'borderless',
    width,
    height,
    flex,
    ref,
    ...rest
  }) => {
    const [code, setCode] = useMergeState(defaultValue, {
      defaultValue,
      onChange: onValueChange,
      value,
    });

    return (
      <Flexbox
        flex={flex}
        height={height}
        width={width}
        {...styleProps(
          [styles.root, variantStyles[variant]],
          clsx(
            'lobe-code-editor',
            variant === 'borderless' && 'lobe-code-editor-borderless',
            className,
          ),
          style,
        )}
      >
        {value ? (
          <SyntaxHighlighterImpl
            className={clsx('lobe-code-editor-highlight', classNames?.highlight)}
            language={language}
            style={customStyles?.highlight}
            variant={variant}
            xstyle={styles.highlight}
          >
            {value}
          </SyntaxHighlighterImpl>
        ) : (
          <pre
            {...styleProps(
              styles.highlight,
              clsx('lobe-code-editor-highlight', classNames?.highlight),
              {
                color: cssVar.colorTextDescription,
              },
            )}
          >
            {placeholder || ' '}
          </pre>
        )}

        <textarea
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          autoFocus={autoFocus}
          data-gramm={false}
          ref={ref}
          value={code}
          onChange={(e) => {
            onChange?.(e);
            setCode(e.target.value);
          }}
          {...styleProps(styles.textarea, classNames?.textarea, customStyles?.textarea)}
          {...rest}
        />
      </Flexbox>
    );
  },
);

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor;
