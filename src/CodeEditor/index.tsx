import { InputRef } from 'antd';
import {
  type CSSProperties,
  type FocusEventHandler,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type Ref,
  forwardRef,
  memo,
} from 'react';
import Editor from 'react-simple-code-editor';

import SyntaxHighlighter, { SyntaxHighlighterProps } from '@/Highlighter/SyntaxHighlighter';

import { useStyles } from './style';

export interface CodeEditorProps {
  autoFocus?: boolean;
  className?: string;
  disabled?: boolean;
  form?: string;
  ignoreTabKey?: boolean;
  insertSpaces?: boolean;
  language: SyntaxHighlighterProps['language'];
  maxLength?: number;
  minLength?: number;
  name?: string;
  onBlur?: FocusEventHandler<HTMLTextAreaElement>;
  onClick?: MouseEventHandler<HTMLTextAreaElement>;
  onFocus?: FocusEventHandler<HTMLTextAreaElement>;
  onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>;
  onKeyUp?: KeyboardEventHandler<HTMLTextAreaElement>;
  onValueChange: (value: string) => void;
  placeholder?: string;
  preClassName?: string;
  readOnly?: boolean;
  ref?: Ref<InputRef>;
  required?: boolean;
  resize?: boolean;
  style?: CSSProperties;
  tabSize?: number;
  textareaClassName?: string;
  textareaId?: string;
  theme?: SyntaxHighlighterProps['theme'];
  type?: 'ghost' | 'block' | 'pure';
  value: string;
}

const CodeEditor = memo<CodeEditorProps>(
  forwardRef(
    (
      {
        style,
        language,
        theme,
        value,
        onValueChange,
        resize = true,
        className,
        textareaClassName,
        type = 'ghost',
        ...props
      },
      reference: any,
    ) => {
      const { styles, cx } = useStyles({ resize, type });
      return (
        <div className={cx(styles.container, className)} style={style}>
          {/* @ts-ignore */}
          <Editor
            className={styles.editor}
            highlight={(code) => (
              <SyntaxHighlighter language={language} theme={theme}>
                {code}
              </SyntaxHighlighter>
            )}
            onValueChange={onValueChange}
            padding={0}
            ref={reference}
            textareaClassName={cx(styles.textarea, textareaClassName)}
            value={value}
            {...props}
          />
        </div>
      );
    },
  ),
);

export default CodeEditor;
