'use client';

import { cva } from 'class-variance-authority';
import { CSSProperties, forwardRef, useMemo } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';
import useMergeState from 'use-merge-value';

import { useStyles } from '@/CodeEditor/style';
import { TextAreaProps } from '@/types';

import SyntaxHighlighter from '../Highlighter/SyntaxHighlighter';

export interface CodeEditorProps
  extends TextAreaProps,
    Pick<FlexboxProps, 'width' | 'height' | 'flex'> {
  classNames?: {
    highlight?: string;
    textarea?: string;
  };
  defaultValue?: string;
  language: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  style?: CSSProperties;
  styles?: {
    highlight?: CSSProperties;
    textarea?: CSSProperties;
  };
  value: string;
  variant?: 'filled' | 'outlined' | 'borderless';
}

const CodeEditor = forwardRef<HTMLTextAreaElement, CodeEditorProps>(
  (
    {
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
      ...rest
    },
    ref,
  ) => {
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
            {placeholder}
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
