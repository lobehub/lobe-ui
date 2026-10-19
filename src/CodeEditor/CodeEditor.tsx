'use client';

import clsx from 'clsx';
import { memo } from 'react';

import { Flexbox } from '@/Flex';
import { SyntaxHighlighterImpl } from '@/Highlighter/SyntaxHighlighter';
import { useControlledState } from '@/hooks/useControlledState';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { codeEditorClasses } from './stable';
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
    const [code, setCode] = useControlledState(defaultValue, {
      defaultValue,
      onChange: onValueChange,
      value,
    });

    return (
      <Flexbox
        flex={flex}
        height={height ?? 'fit-content'}
        width={width ?? '100%'}
        {...toDataAttributes({ variant })}
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
            language={language}
            style={customStyles?.highlight}
            variant={variant}
            xstyle={styles.highlight}
            className={clsx(
              'lobe-code-editor-highlight',
              codeEditorClasses('highlight'),
              classNames?.highlight,
            )}
          >
            {value}
          </SyntaxHighlighterImpl>
        ) : (
          <pre
            {...styleProps(
              [styles.highlight, styles.placeholder],
              clsx(
                'lobe-code-editor-highlight',
                codeEditorClasses('highlight'),
                classNames?.highlight,
              ),
              customStyles?.highlight,
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
          {...styleProps(
            styles.textarea,
            clsx(codeEditorClasses('textarea'), classNames?.textarea),
            customStyles?.textarea,
          )}
          {...rest}
        />
      </Flexbox>
    );
  },
);

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor;
