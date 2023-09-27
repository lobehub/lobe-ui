import { type TextAreaRef } from 'antd/es/input/TextArea';
import {
  type CSSProperties,
  type FocusEventHandler,
  type KeyboardEventHandler,
  type MouseEventHandler,
  forwardRef,
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
  required?: boolean;
  resize?: boolean;
  style?: CSSProperties;
  tabSize?: number;
  textareaClassName?: string;
  textareaId?: string;
  type?: 'ghost' | 'block' | 'pure';
  value: string;
}

const CodeEditor = forwardRef<TextAreaRef, CodeEditorProps>(
  (
    {
      style,
      language,
      value,
      onValueChange,
      resize = true,
      className,
      textareaClassName,
      type = 'ghost',
      ...props
    },
    ref,
  ) => {
    const { styles, cx } = useStyles({ resize, type });
    return (
      <div className={cx(styles.container, className)} style={style}>
        {/* @ts-ignore */}
        <Editor
          className={styles.editor}
          highlight={(code) => <SyntaxHighlighter language={language}>{code}</SyntaxHighlighter>}
          onValueChange={onValueChange}
          padding={0}
          ref={ref as any}
          textareaClassName={cx(styles.textarea, textareaClassName)}
          value={value}
          {...props}
        />
      </div>
    );
  },
);

export default CodeEditor;
