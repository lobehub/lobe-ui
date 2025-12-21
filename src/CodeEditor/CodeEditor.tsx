'use client';

import { cva } from 'class-variance-authority';
import { memo, useMemo } from 'react';
import useMergeState from 'use-merge-value';

import { useStyles } from '@/CodeEditor/style';
import { Flexbox } from '@/Flex';
import SyntaxHighlighter from '@/Highlighter/SyntaxHighlighter';

import { CodeEditorProps } from './type';

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
    const { styles, cx, theme } = useStyles();
    const [code, setCode] = useMergeState(defaultValue, {
      defaultValue,
      onChange: onValueChange,
      value,
    });

    const variants = useMemo(
      () =>
        cva(styles.root, {
          defaultVariants: {
            variant: 'borderless',
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            variant: {
              filled: styles.filled,
              outlined: styles.outlined,
              borderless: styles.borderless,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    return (
      <Flexbox
        className={cx(variants({ variant }), className)}
        flex={flex}
        height={height}
        style={style}
        width={width}
      >
        {value ? (
          <SyntaxHighlighter
            className={cx(styles.highlight, classNames?.highlight)}
            language={language}
            style={customStyles?.highlight}
            variant={variant}
          >
            {value}
          </SyntaxHighlighter>
        ) : (
          <pre
            className={cx(styles.highlight, classNames?.highlight)}
            style={{
              color: theme.colorTextDescription,
            }}
          >
            {placeholder || ' '}
          </pre>
        )}

        <textarea
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          autoFocus={autoFocus}
          className={cx(styles.textarea, classNames?.textarea)}
          data-gramm={false}
          onChange={(e) => {
            onChange?.(e);
            setCode(e.target.value);
          }}
          ref={ref}
          style={customStyles?.textarea}
          value={code}
          {...rest}
        />
      </Flexbox>
    );
  },
);

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor;
