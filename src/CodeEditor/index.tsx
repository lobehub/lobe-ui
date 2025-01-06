import {
  CSSProperties,
  ChangeEvent,
  FocusEventHandler,
  KeyboardEvent,
  KeyboardEventHandler,
  MouseEventHandler,
  Ref,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

import { useStyles } from '@/CodeEditor/style';

import SyntaxHighlighter from '../Highlighter/SyntaxHighlighter';

export interface CodeEditorProps
  extends Omit<FlexboxProps, 'onFocus' | 'onBlur' | 'onKeyUp' | 'onKeyDown' | 'onClick'> {
  autoFocus?: boolean;
  classNames?: {
    highlight?: string;
    textarea?: string;
  };
  disabled?: boolean;
  fontSize?: number | string;
  form?: string;
  ignoreTabKey?: boolean;
  insertSpaces?: boolean;
  language: string;
  maxLength?: number;
  minLength?: number;
  onBlur?: FocusEventHandler<HTMLTextAreaElement>;
  onClick?: MouseEventHandler<HTMLTextAreaElement>;
  onFocus?: FocusEventHandler<HTMLTextAreaElement>;
  onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>;
  onKeyUp?: KeyboardEventHandler<HTMLTextAreaElement>;
  onValueChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  style?: CSSProperties;
  styles?: {
    highlight?: CSSProperties;
    textarea?: CSSProperties;
  };
  tabSize?: number;
  textareaId?: string;
  value: string;
  variant?: 'ghost' | 'block' | 'pure';
}

type Record = {
  selectionEnd: number;
  selectionStart: number;
  value: string;
};

type History = {
  offset: number;
  stack: (Record & { timestamp: number })[];
};

const KEYCODE_Y = 89;
const KEYCODE_Z = 90;
const KEYCODE_M = 77;
const KEYCODE_PARENS = 57;
const KEYCODE_BRACKETS = 219;
const KEYCODE_QUOTE = 222;
const KEYCODE_BACK_QUOTE = 192;

const HISTORY_LIMIT = 100;
const HISTORY_TIME_GAP = 3000;

const isWindows =
  typeof window !== 'undefined' && 'navigator' in window && /win/i.test(navigator.platform);
const isMacLike =
  typeof window !== 'undefined' &&
  'navigator' in window &&
  /(mac|iphone|ipod|ipad)/i.test(navigator.platform);

const getLines = (text: string, position: number) =>
  text.slice(0, Math.max(0, position)).split('\n');

const Editor = forwardRef<Ref<null | { session: { history: History } }>, CodeEditorProps>(
  (
    {
      autoFocus,
      disabled,
      form,
      classNames = {},
      styles: s = {},
      ignoreTabKey = false,
      insertSpaces = true,
      maxLength,
      minLength,
      onBlur,
      onClick,
      onFocus,
      onKeyDown,
      onKeyUp,
      onValueChange,
      placeholder,
      readOnly,
      required,
      style,
      className,
      tabSize = 2,
      textareaId,
      value,
      language,
      fontSize = 12,
      variant = 'ghost',
      ...rest
    },
    ref,
  ) => {
    const { styles, cx } = useStyles({ fontSize, variant });

    const historyRef = useRef<History>({
      offset: -1,
      stack: [],
    });
    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const [capture, setCapture] = useState(true);

    const recordChange = useCallback((record: Record, overwrite: boolean = false) => {
      const { stack, offset } = historyRef.current;

      if (stack.length > 0 && offset > -1) {
        // When something updates, drop the redo operations
        historyRef.current.stack = stack.slice(0, offset + 1);

        // Limit the number of operations to 100
        const count = historyRef.current.stack.length;

        if (count > HISTORY_LIMIT) {
          const extras = count - HISTORY_LIMIT;

          historyRef.current.stack = stack.slice(extras, count);
          historyRef.current.offset = Math.max(historyRef.current.offset - extras, 0);
        }
      }

      const timestamp = Date.now();

      if (overwrite) {
        const last = historyRef.current.stack[historyRef.current.offset];

        if (last && timestamp - last.timestamp < HISTORY_TIME_GAP) {
          // A previous entry exists and was in short interval

          // Match the last word in the line
          const re = /[^\da-z]([\da-z]+)$/i;

          // Get the previous line
          const previous = getLines(last.value, last.selectionStart).pop()?.match(re);

          // Get the current line
          const current = getLines(record.value, record.selectionStart).pop()?.match(re);

          if (previous?.[1] && current?.[1]?.startsWith(previous[1])) {
            // The last word of the previous line and current line match
            // Overwrite previous entry so that undo will remove whole word
            historyRef.current.stack[historyRef.current.offset] = {
              ...record,
              timestamp,
            };

            return;
          }
        }
      }

      // Add the new operation to the stack
      historyRef.current.stack.push({ ...record, timestamp });
      historyRef.current.offset++;
    }, []);

    const recordCurrentState = useCallback(() => {
      const input = inputRef.current;

      if (!input) return;

      // Save current state of the input
      const { value, selectionStart, selectionEnd } = input;

      recordChange({
        selectionEnd,
        selectionStart,
        value,
      });
    }, [recordChange]);

    const updateInput = (record: Record) => {
      const input = inputRef.current;

      if (!input) return;

      // Update values and selection state
      input.value = record.value;
      input.selectionStart = record.selectionStart;
      input.selectionEnd = record.selectionEnd;

      onValueChange?.(record.value);
    };

    const applyEdits = (record: Record) => {
      // Save last selection state
      const input = inputRef.current;
      const last = historyRef.current.stack[historyRef.current.offset];

      if (last && input) {
        historyRef.current.stack[historyRef.current.offset] = {
          ...last,
          selectionEnd: input.selectionEnd,
          selectionStart: input.selectionStart,
        };
      }

      // Save the changes
      recordChange(record);
      updateInput(record);
    };

    const undoEdit = () => {
      const { stack, offset } = historyRef.current;

      // Get the previous edit
      const record = stack[offset - 1];

      if (record) {
        // Apply the changes and update the offset
        updateInput(record);
        historyRef.current.offset = Math.max(offset - 1, 0);
      }
    };

    const redoEdit = () => {
      const { stack, offset } = historyRef.current;

      // Get the next edit
      const record = stack[offset + 1];

      if (record) {
        // Apply the changes and update the offset
        updateInput(record);
        historyRef.current.offset = Math.min(offset + 1, stack.length - 1);
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (onKeyDown) {
        onKeyDown(e);

        if (e.defaultPrevented) {
          return;
        }
      }

      if (e.key === 'Escape') {
        e.currentTarget.blur();
      }

      const { value, selectionStart, selectionEnd } = e.currentTarget;

      const tabCharacter = (insertSpaces ? ' ' : '\t').repeat(tabSize);

      if (e.key === 'Tab' && !ignoreTabKey && capture) {
        // Prevent focus change
        e.preventDefault();

        if (e.shiftKey) {
          // Unindent selected lines
          const linesBeforeCaret = getLines(value, selectionStart);
          const startLine = linesBeforeCaret.length - 1;
          const endLine = getLines(value, selectionEnd).length - 1;
          const nextValue = value
            .split('\n')
            .map((line, i) => {
              if (i >= startLine && i <= endLine && line.startsWith(tabCharacter)) {
                return line.slice(tabCharacter.length);
              }

              return line;
            })
            .join('\n');

          if (value !== nextValue) {
            const startLineText = linesBeforeCaret[startLine];

            applyEdits({
              // Move the end cursor by total number of characters removed
              selectionEnd: selectionEnd - (value.length - nextValue.length),

              // Move the start cursor if first line in selection was modified
              // It was modified only if it started with a tab
              selectionStart: startLineText?.startsWith(tabCharacter)
                ? selectionStart - tabCharacter.length
                : selectionStart,

              value: nextValue,
            });
          }
        } else if (selectionStart === selectionEnd) {
          const updatedSelection = selectionStart + tabCharacter.length;

          applyEdits({
            selectionEnd: updatedSelection,

            // Update caret position
            selectionStart: updatedSelection,
            // Insert tab character at caret
            value:
              value.slice(0, Math.max(0, selectionStart)) +
              tabCharacter +
              value.slice(Math.max(0, selectionEnd)),
          });
        } else {
          // Indent selected lines
          const linesBeforeCaret = getLines(value, selectionStart);
          const startLine = linesBeforeCaret.length - 1;
          const endLine = getLines(value, selectionEnd).length - 1;
          const startLineText = linesBeforeCaret[startLine];

          applyEdits({
            // Move the end cursor by total number of characters added
            selectionEnd: selectionEnd + tabCharacter.length * (endLine - startLine + 1),

            // Move the start cursor by number of characters added in first line of selection
            // Don't move it if it there was no text before cursor
            selectionStart:
              startLineText && /\S/.test(startLineText)
                ? selectionStart + tabCharacter.length
                : selectionStart,

            value: value
              .split('\n')
              .map((line, i) => {
                if (i >= startLine && i <= endLine) {
                  return tabCharacter + line;
                }

                return line;
              })
              .join('\n'),
          });
        }
      } else if (e.key === 'Backspace') {
        const hasSelection = selectionStart !== selectionEnd;
        const textBeforeCaret = value.slice(0, Math.max(0, selectionStart));

        if (textBeforeCaret.endsWith(tabCharacter) && !hasSelection) {
          // Prevent default delete behaviour
          e.preventDefault();

          const updatedSelection = selectionStart - tabCharacter.length;

          applyEdits({
            selectionEnd: updatedSelection,

            // Update caret position
            selectionStart: updatedSelection,
            // Remove tab character at caret
            value:
              value.slice(0, Math.max(0, selectionStart - tabCharacter.length)) +
              value.slice(Math.max(0, selectionEnd)),
          });
        }
      } else if (e.key === 'Enter') {
        // Ignore selections
        if (selectionStart === selectionEnd) {
          // Get the current line
          const line = getLines(value, selectionStart).pop();
          const matches = line?.match(/^\s+/);

          if (matches?.[0]) {
            e.preventDefault();

            // Preserve indentation on inserting a new line
            const indent = '\n' + matches[0];
            const updatedSelection = selectionStart + indent.length;

            applyEdits({
              selectionEnd: updatedSelection,

              // Update caret position
              selectionStart: updatedSelection,
              // Insert indentation character at caret
              value:
                value.slice(0, Math.max(0, selectionStart)) +
                indent +
                value.slice(Math.max(0, selectionEnd)),
            });
          }
        }
      } else if (
        e.keyCode === KEYCODE_PARENS ||
        e.keyCode === KEYCODE_BRACKETS ||
        e.keyCode === KEYCODE_QUOTE ||
        e.keyCode === KEYCODE_BACK_QUOTE
      ) {
        let chars;

        if (e.keyCode === KEYCODE_PARENS && e.shiftKey) {
          chars = ['(', ')'];
        } else if (e.keyCode === KEYCODE_BRACKETS) {
          chars = e.shiftKey ? ['{', '}'] : ['[', ']'];
        } else if (e.keyCode === KEYCODE_QUOTE) {
          chars = e.shiftKey ? ['"', '"'] : ["'", "'"];
        } else if (e.keyCode === KEYCODE_BACK_QUOTE && !e.shiftKey) {
          chars = ['`', '`'];
        }

        // If text is selected, wrap them in the characters
        if (selectionStart !== selectionEnd && chars) {
          e.preventDefault();

          applyEdits({
            selectionEnd: selectionEnd + 2,

            // Update caret position
            selectionStart,
            value:
              value.slice(0, Math.max(0, selectionStart)) +
              chars[0] +
              // eslint-disable-next-line unicorn/prefer-string-slice
              value.substring(selectionStart, selectionEnd) +
              chars[1] +
              value.slice(Math.max(0, selectionEnd)),
          });
        }
      } else if (
        (isMacLike
          ? // Trigger undo with ⌘+Z on Mac
            e.metaKey && e.keyCode === KEYCODE_Z
          : // Trigger undo with Ctrl+Z on other platforms
            e.ctrlKey && e.keyCode === KEYCODE_Z) &&
        !e.shiftKey &&
        !e.altKey
      ) {
        e.preventDefault();

        undoEdit();
      } else if (
        (isMacLike
          ? // Trigger redo with ⌘+Shift+Z on Mac
            e.metaKey && e.keyCode === KEYCODE_Z && e.shiftKey
          : isWindows
            ? // Trigger redo with Ctrl+Y on Windows
              e.ctrlKey && e.keyCode === KEYCODE_Y
            : // Trigger redo with Ctrl+Shift+Z on other platforms
              e.ctrlKey && e.keyCode === KEYCODE_Z && e.shiftKey) &&
        !e.altKey
      ) {
        e.preventDefault();

        redoEdit();
      } else if (e.keyCode === KEYCODE_M && e.ctrlKey && (isMacLike ? e.shiftKey : true)) {
        e.preventDefault();

        // Toggle capturing tab key so users can focus away
        setCapture((prev) => !prev);
      }
    };

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      const { value, selectionStart, selectionEnd } = e.currentTarget;

      recordChange(
        {
          selectionEnd,
          selectionStart,
          value,
        },
        true,
      );

      onValueChange(value);
    };

    useEffect(() => {
      recordCurrentState();
    }, [recordCurrentState]);

    // @ts-ignore
    useImperativeHandle(ref, () => {
      return {
        get session() {
          return {
            history: historyRef.current,
          };
        },
        set session(session: { history: History }) {
          historyRef.current = session.history;
        },
      };
    }, []);

    return (
      <Flexbox className={cx(styles.container, className)} style={style} {...rest}>
        <div className={styles.editor}>
          <SyntaxHighlighter
            className={cx(styles.highlight, classNames?.highlight)}
            language={language}
            style={s.highlight}
          >
            {value}
          </SyntaxHighlighter>
          <textarea
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            autoFocus={autoFocus}
            className={cx(styles.textarea, classNames?.textarea)}
            data-gramm={false}
            disabled={disabled}
            form={form}
            id={textareaId}
            maxLength={maxLength}
            minLength={minLength}
            onBlur={onBlur}
            onChange={handleChange}
            onClick={onClick}
            onFocus={onFocus}
            onKeyDown={handleKeyDown}
            onKeyUp={onKeyUp}
            placeholder={placeholder}
            readOnly={readOnly}
            // @ts-ignore
            ref={(c) => (inputRef.current = c)}
            required={required}
            spellCheck={false}
            style={{
              ...s?.textarea,
            }}
            value={value}
          />
        </div>
      </Flexbox>
    );
  },
);

export default Editor;
