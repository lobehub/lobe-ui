import { clsx } from 'clsx';
import * as React from 'react';

import { useEvent, useLayoutEffect } from '../../hooks/react';
import type { PickerRef } from '../../interface';
import { raf } from '../../utils/common';
import { leftPad } from '../../utils/miscUtil';
import PickerContext from '../context';
import useLockEffect from '../hooks/useLockEffect';
import Icon from './Icon';
import MaskFormat from './MaskFormat';
import { getMaskRange } from './util';

// Format logic
//
// First time on focus:
//  1. check if the text is valid, if not fill with format
//  2. set highlight cell to the first cell
// Cells
//  1. Selection the index cell, set inner `cacheValue` to ''
//  2. Key input filter non-number char, patch after the `cacheValue`
//    1. Replace the `cacheValue` with input align the cell length
//    2. Re-selection the mask cell
//  3. If `cacheValue` match the limit length or cell format (like 1 ~ 12 month), go to next cell

export interface InputRef extends PickerRef {
  inputElement: HTMLInputElement;
}

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  active?: boolean;
  clearIcon?: React.ReactNode;
  format?: string | null;
  /** Meaning current is from the hover cell getting the placeholder text */
  helped?: boolean;
  invalid?: boolean;
  onChange: (value: string) => void;
  /**
   * Trigger when input need additional help.
   * Like open the popup for interactive.
   */
  onHelp: () => void;
  onSubmit: VoidFunction;
  preserveInvalidOnBlur?: boolean;
  /** Used for single picker only */
  showActiveCls?: boolean;
  suffixIcon?: React.ReactNode;
  validateFormat: (value: string) => boolean;

  value?: string;
}

const Input = ({ ref, ...props }: InputProps & { ref?: React.RefObject<InputRef | null> }) => {
  const {
    className,
    active,
    showActiveCls = true,
    suffixIcon,
    format,
    validateFormat,
    onChange,
    onInput,
    helped,
    onHelp,
    onSubmit,
    onKeyDown,
    preserveInvalidOnBlur = false,
    invalid,
    clearIcon,
    // Pass to input
    ...restProps
  } = props;
  const { value, onFocus, onBlur, onMouseUp } = props;

  const { prefixCls, input: Component = 'input', classNames, styles } = React.use(PickerContext);
  const inputPrefixCls = `${prefixCls}-input`;

  // ======================== Value =========================
  const [focused, setFocused] = React.useState(false);
  const [internalInputValue, setInputValue] = React.useState<string | undefined>(value);
  const [focusCellText, setFocusCellText] = React.useState<string>('');
  const [focusCellIndex, setFocusCellIndex] = React.useState<number | null>(null);
  const [forceSelectionSyncMark, forceSelectionSync] = React.useState<object | null>(null);

  const inputValue = internalInputValue || '';

  // Sync value if needed
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  // ========================= Refs =========================
  const holderRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  // When mousedown get focus, defer selection to mouseUp so click position is used
  const mouseDownRef = React.useRef(false);

  React.useImperativeHandle(ref, () => ({
    nativeElement: holderRef.current!,
    inputElement: inputRef.current!,
    focus: (options) => {
      inputRef.current!.focus(options);
    },
    blur: () => {
      inputRef.current!.blur();
    },
  }));

  // ======================== Format ========================
  const maskFormat = React.useMemo(() => new MaskFormat(format || ''), [format]);

  const [selectionStart, selectionEnd] = React.useMemo(() => {
    if (helped) {
      return [0, 0];
    }

    return maskFormat.getSelection(focusCellIndex!);
  }, [maskFormat, focusCellIndex, helped]);

  // ======================== Modify ========================
  // When input modify content, trigger `onHelp` if is not the format
  const onModify = (text: string) => {
    if (text && text !== format && text !== value) {
      onHelp();
    }
  };

  // ======================== Change ========================
  /**
   * Triggered by paste, keyDown and focus to show format
   */
  const triggerInputChange = useEvent((text: string) => {
    if (validateFormat(text)) {
      onChange(text);
    }
    setInputValue(text);
    onModify(text);
  });

  // Directly trigger `onChange` if `format` is empty
  const onInternalChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    // Hack `onChange` with format to do nothing
    if (!format) {
      const text = event.target.value;

      onModify(text);
      setInputValue(text);
      onChange(text);
    }
  };

  const onFormatPaste: React.ClipboardEventHandler<HTMLInputElement> = (event) => {
    // Block paste until selection is set (after mouseUp when focus was by mousedown)
    if (mouseDownRef.current) {
      event.preventDefault();
      return;
    }

    // Get paste text
    const pasteText = event.clipboardData.getData('text');

    if (validateFormat(pasteText)) {
      triggerInputChange(pasteText);
    }
  };

  // ======================== Mouse =========================
  // When `mouseDown` get focus, it's better to not to change the selection
  // Since the up position maybe not is the first cell
  const onFormatMouseDown: React.MouseEventHandler<HTMLInputElement> = () => {
    mouseDownRef.current = true;
  };

  const onFormatMouseUp: React.MouseEventHandler<HTMLInputElement> = (event) => {
    const { selectionStart: start } = event.target as HTMLInputElement;

    const closeMaskIndex = maskFormat.getMaskCellIndex(start!);
    setFocusCellIndex(closeMaskIndex);

    // Force update the selection
    forceSelectionSync({});

    onMouseUp?.(event);

    mouseDownRef.current = false;
  };

  // ====================== Focus Blur ======================
  const onFormatFocus: React.FocusEventHandler<HTMLInputElement> = (event) => {
    setFocused(true);
    setFocusCellIndex(0);
    setFocusCellText('');

    onFocus!(event);
  };

  const onSharedBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
    onBlur!(event);
  };

  const onFormatBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
    setFocused(false);

    onSharedBlur(event);
  };

  // ======================== Active ========================
  // Check if blur need reset input value
  useLockEffect(active, () => {
    if (!active && !preserveInvalidOnBlur) {
      setInputValue(value);
    }
  });

  // ======================= Keyboard =======================
  const onSharedKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter' && validateFormat(inputValue)) {
      onSubmit();
    }

    onKeyDown?.(event);
  };

  const onFormatKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    // Block key input until selection is set (after mouseUp when focus was by mousedown)
    if (mouseDownRef.current) {
      event.preventDefault();
      return;
    }

    onSharedKeyDown(event);

    const { key } = event;

    // Save the cache with cell text
    let nextCellText: string | null = null;

    // Fill in the input
    let nextFillText: string | null = null;

    const maskCellLen = selectionEnd - selectionStart;
    const cellFormat = format!.slice(selectionStart, selectionEnd);

    // Cell Index
    const offsetCellIndex = (offset: number) => {
      setFocusCellIndex((idx) => {
        let nextIndex = idx! + offset;
        nextIndex = Math.max(nextIndex, 0);
        nextIndex = Math.min(nextIndex, maskFormat.size() - 1);
        return nextIndex;
      });
    };

    // Range
    const offsetCellValue = (offset: number) => {
      const [rangeStart, rangeEnd, rangeDefault] = getMaskRange(cellFormat);

      const currentText = inputValue.slice(selectionStart, selectionEnd);
      const currentTextNum = Number(currentText);

      if (isNaN(currentTextNum)) {
        return String(rangeDefault ? rangeDefault : offset > 0 ? rangeStart : rangeEnd);
      }

      const num = currentTextNum + offset;
      const range = rangeEnd - rangeStart + 1;
      return String(rangeStart + ((range + num - rangeStart) % range));
    };

    switch (key) {
      // =============== Remove ===============
      case 'Backspace':
      case 'Delete': {
        nextCellText = '';
        nextFillText = cellFormat;
        break;
      }

      // =============== Arrows ===============
      // Left key
      case 'ArrowLeft': {
        nextCellText = '';
        offsetCellIndex(-1);
        break;
      }

      // Right key
      case 'ArrowRight': {
        nextCellText = '';
        offsetCellIndex(1);
        break;
      }

      // Up key
      case 'ArrowUp': {
        nextCellText = '';
        nextFillText = offsetCellValue(1);
        break;
      }

      // Down key
      case 'ArrowDown': {
        nextCellText = '';
        nextFillText = offsetCellValue(-1);
        break;
      }

      // =============== Number ===============
      default: {
        if (!isNaN(Number(key))) {
          nextCellText = focusCellText + key;
          nextFillText = nextCellText;
        }
        break;
      }
    }

    // Update cell text
    if (nextCellText !== null) {
      setFocusCellText(nextCellText);

      if (nextCellText.length >= maskCellLen) {
        // Go to next cell
        offsetCellIndex(1);
        setFocusCellText('');
      }
    }

    // Update the input text
    if (nextFillText !== null) {
      // Replace selection range with `nextCellText`
      const nextFocusValue =
        // before
        inputValue.slice(0, selectionStart) +
        // replace
        leftPad(nextFillText, maskCellLen) +
        // after
        inputValue.slice(selectionEnd);
      triggerInputChange(nextFocusValue.slice(0, format!.length));
    }

    // Always trigger selection sync after key down
    forceSelectionSync({});
  };

  // ======================== Format ========================
  const rafRef = React.useRef<number | undefined>(undefined);

  useLayoutEffect(() => {
    if (!focused || !format || mouseDownRef.current) {
      return;
    }

    // Reset with format if not match
    if (!maskFormat.match(inputValue)) {
      triggerInputChange(format);
      return;
    }

    // Match the selection range
    inputRef.current!.setSelectionRange(selectionStart, selectionEnd);

    // Chrome has the bug anchor position looks not correct but actually correct
    rafRef.current = raf(() => {
      inputRef.current!.setSelectionRange(selectionStart, selectionEnd);
    });

    return () => {
      raf.cancel(rafRef.current!);
    };
  }, [
    maskFormat,
    format,
    focused,
    inputValue,
    focusCellIndex,
    selectionStart,
    selectionEnd,
    forceSelectionSyncMark,
    triggerInputChange,
  ]);

  // ======================== Render ========================
  // Input props for format
  const inputProps: React.InputHTMLAttributes<HTMLInputElement> = format
    ? {
        onFocus: onFormatFocus,
        onBlur: onFormatBlur,
        onKeyDown: onFormatKeyDown,
        onMouseDown: onFormatMouseDown,
        onMouseUp: onFormatMouseUp,
        onPaste: onFormatPaste,
      }
    : {};

  return (
    <div
      ref={holderRef}
      className={clsx(
        inputPrefixCls,
        {
          [`${inputPrefixCls}-active`]: active && showActiveCls,
          [`${inputPrefixCls}-placeholder`]: helped,
        },
        className,
      )}
    >
      <Component
        aria-invalid={invalid}
        autoComplete="off"
        ref={inputRef}
        {...restProps}
        onKeyDown={onSharedKeyDown}
        onBlur={onSharedBlur}
        // Replace with format
        {...inputProps}
        // Value
        className={classNames.input}
        style={styles.input}
        value={inputValue}
        onChange={onInternalChange}
      />
      <Icon icon={suffixIcon} />
      {clearIcon}
    </div>
  );
};

if (process.env.NODE_ENV !== 'production') {
  Input.displayName = 'Input';
}

export default Input;
