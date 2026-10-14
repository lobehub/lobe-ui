import * as React from 'react';

import type { NullableDateType, SelectorProps } from '../../../interface';
import { pickAttrs, warning } from '../../../utils/common';
import { formatValue } from '../../../utils/dateUtil';
import type { InputProps } from '../Input';

export default function useInputProps<DateType extends object = any>(
  props: Pick<
    SelectorProps,
    | 'maskFormat'
    | 'format'
    | 'generateConfig'
    | 'locale'
    | 'preserveInvalidOnBlur'
    | 'inputReadOnly'
    | 'required'
    | 'aria-required'
    | 'onSubmit'
    | 'onFocus'
    | 'onBlur'
    | 'onInputChange'
    | 'onInvalid'
    | 'onOpenChange'
    | 'onKeyDown'
    | 'activeHelp'
    | 'name'
    | 'autoComplete'
    | 'open'
    | 'picker'
  > & {
    id?: string | (string | undefined)[];
    value?: NullableDateType<DateType>[];
    invalid?: boolean | [boolean, boolean];
    placeholder?: string | [string | undefined, string | undefined];
    disabled?: boolean | [boolean, boolean];
    onChange: (value: DateType, index?: number) => void;

    // RangePicker only
    allHelp: boolean;
    activeIndex?: number | null;
  },
  /** Used for SinglePicker */
  postProps?: (info: { valueTexts: string[] }) => Partial<InputProps>,
) {
  const {
    format,
    maskFormat,
    generateConfig,
    locale,
    preserveInvalidOnBlur,
    inputReadOnly,
    required,
    'aria-required': ariaRequired,
    onSubmit,
    onFocus,
    onBlur,
    onInputChange,
    onInvalid,
    open,
    onOpenChange,
    onKeyDown,
    onChange,
    activeHelp,
    name,
    autoComplete,

    id,
    value,
    invalid,
    placeholder,
    disabled,
    activeIndex,
    allHelp,

    picker,
  } = props;

  // ======================== Parser ========================
  const parseDate = (str: string, formatStr: string) => {
    const parsed = generateConfig.locale.parse(locale.locale, str, [formatStr]);
    return parsed && generateConfig.isValidate(parsed) ? parsed : null;
  };

  // ========================= Text =========================
  const firstFormat = format[0];

  const getText = React.useCallback(
    (date: NullableDateType<DateType>) =>
      formatValue(date, { locale, format: firstFormat, generateConfig }),
    [locale, generateConfig, firstFormat],
  );

  const valueTexts = React.useMemo(() => value!.map(getText), [value, getText]);

  // ========================= Size =========================
  const size = React.useMemo(() => {
    const defaultSize = picker === 'time' ? 8 : 10;
    const length =
      typeof firstFormat === 'function'
        ? firstFormat(generateConfig.getNow()).length
        : firstFormat.length;
    return Math.max(defaultSize, length) + 2;
  }, [firstFormat, picker, generateConfig]);

  // ======================= Validate =======================
  const validateFormat = (text: string) => {
    for (let i = 0; i < format.length; i += 1) {
      const singleFormat = format[i];

      // Only support string type
      if (typeof singleFormat === 'string') {
        const parsed = parseDate(text, singleFormat);

        if (parsed) {
          return parsed;
        }
      }
    }

    return false;
  };

  // ======================== Input =========================
  const getInputProps = (index?: number): InputProps => {
    function getProp<T>(propValue: T | T[]): T {
      return index !== undefined ? (propValue as T[])[index] : (propValue as T);
    }

    const pickedAttrs = pickAttrs(props, { attr: false });

    const inputProps = {
      ...pickedAttrs,

      // ============== Shared ==============
      'format': maskFormat,
      'validateFormat': (text: string) => !!validateFormat(text),
      preserveInvalidOnBlur,

      'readOnly': inputReadOnly,

      required,
      'aria-required': ariaRequired,

      name,

      autoComplete,

      size,

      // ============= By Index =============
      'id': getProp(id),

      'value': getProp(valueTexts) || '',

      'invalid': getProp(invalid),

      'placeholder': getProp(placeholder),

      'active': activeIndex === index,

      'helped': allHelp || (activeHelp && activeIndex === index),

      'disabled': getProp(disabled),

      'onFocus': (event: React.FocusEvent<HTMLInputElement>) => {
        onFocus(event, index);
      },
      'onBlur': (event: React.FocusEvent<HTMLInputElement>) => {
        // Blur do not trigger close
        // Since it may focus to the popup panel
        onBlur(event, index);
      },

      onSubmit,

      // Get validate text value
      'onChange': (text: string) => {
        onInputChange();

        const parsed = validateFormat(text);

        if (parsed) {
          onInvalid(false, index);
          onChange(parsed, index);
          return;
        }

        // Tell outer that the value typed is invalid.
        // If text is empty, it means valid.
        onInvalid(!!text, index);
      },
      'onHelp': () => {
        onOpenChange(true, { index });
      },
      'onKeyDown': (event: React.KeyboardEvent<HTMLDivElement>) => {
        let prevented = false;

        onKeyDown?.(event, () => {
          if (process.env.NODE_ENV !== 'production') {
            warning(
              false,
              '`preventDefault` callback is deprecated. Please call `event.preventDefault` directly.',
            );
          }
          prevented = true;
        });

        if (!event.defaultPrevented && !prevented) {
          switch (event.key) {
            case 'Escape': {
              onOpenChange(false, { index });
              break;
            }
            case 'Enter': {
              if (!open) {
                onOpenChange(true);
              }
              break;
            }
          }
        }
      },

      // ============ Post Props ============
      ...postProps?.({ valueTexts }),
    };

    // ============== Clean Up ==============
    Object.keys(inputProps).forEach((key) => {
      if ((inputProps as Record<string, unknown>)[key] === undefined) {
        delete (inputProps as Record<string, unknown>)[key];
      }
    });

    return inputProps;
  };

  return [getInputProps, getText] as const;
}
