import * as React from 'react';

import type { GenerateConfig } from '../../generate';
import { useControlledState, useEvent } from '../../hooks/react';
import useSyncState from '../../hooks/useSyncState';
import type {
  BaseInfo,
  FormatType,
  Locale,
  NullableDateType,
  PickerMode,
  ReplaceListType,
} from '../../interface';
import { formatValue, isSame, isSameTimestamp } from '../../utils/dateUtil';
import { fillIndex } from '../../utils/miscUtil';
import type { RangePickerProps } from '../RangePicker';

const EMPTY_VALUE: any[] = [];

// Submit Logic:
// * ✅ Value:
//    * merged value using controlled value, if not, use stateValue
//    * When merged value change, [1] resync calendar value and submit value
// * ✅ Calender Value:
//    * 💻 When user typing is validate, change the calendar value
//    * 🌅 When user click on the panel, change the calendar value
// * Submit Value:
//    * 💻 When user blur the input, flush calendar value to submit value
//    * 🌅 When user click on the panel is no needConfirm, flush calendar value to submit value
//    * 🌅 When user click on the panel is needConfirm and click OK, flush calendar value to submit value
// * Blur logic & close logic:
//    * ✅ For value, always try flush submit
//    * ✅ If `needConfirm`, reset as [1]
//    * Else (`!needConfirm`)
//      * If has another index field, active another index
// * ✅ Flush submit:
//    * If all the start & end field is confirmed or all blur or panel closed
//    * Update `needSubmit` mark to true
//    * trigger onChange by `needSubmit` and update stateValue

type TriggerCalendarChange<ValueType extends NullableDateType<object>[]> = (
  calendarValues: ValueType,
) => void;

type NoUndefinedList<ValueType> = { [K in keyof ValueType]: Exclude<ValueType[K], undefined> };

function useUtil<
  MergedValueType extends NullableDateType<DateType>[],
  DateType extends object = any,
>(generateConfig: GenerateConfig<DateType>, locale: Locale, formatList: FormatType[]) {
  const getDateTexts = (dates: MergedValueType) => {
    return dates.map((date) =>
      formatValue(date, { generateConfig, locale, format: formatList[0] }),
    ) as any as ReplaceListType<Required<MergedValueType>, string>;
  };

  const isSameDates = (source: MergedValueType, target: MergedValueType) => {
    const maxLen = Math.max(source.length, target.length);
    let diffIndex = -1;

    for (let i = 0; i < maxLen; i += 1) {
      const prev = source[i] || null;
      const next = target[i] || null;

      if (prev !== next && !isSameTimestamp(generateConfig, prev, next)) {
        diffIndex = i;
        break;
      }
    }

    return [diffIndex < 0, diffIndex !== 0];
  };

  return [getDateTexts, isSameDates] as const;
}

function orderDates<DateType extends object, DatesType extends NullableDateType<DateType>[]>(
  dates: DatesType,
  generateConfig: GenerateConfig<DateType>,
) {
  return [...dates].sort((a, b) => (generateConfig.isAfter(a!, b!) ? 1 : -1)) as DatesType;
}

/**
 * Used for internal value management.
 * It should always use `mergedValue` in render logic
 */
function useCalendarValue<MergedValueType extends NullableDateType<object>[]>(
  mergedValue: MergedValueType,
) {
  const [calendarValue, setCalendarValue] = useSyncState(mergedValue);

  /** Sync calendarValue & submitValue back with value */
  const syncWithValue = useEvent(() => {
    setCalendarValue(mergedValue);
  });

  React.useEffect(() => {
    syncWithValue();
  }, [mergedValue]);

  return [calendarValue, setCalendarValue] as const;
}

/**
 * Control the internal `value` align with prop `value` and provide a temp `calendarValue` for ui.
 * The caller controls the temporary `calendarValue` lifecycle through event handlers.
 */
export function useInnerValue<
  ValueType extends NullableDateType<DateType>[],
  DateType extends object = any,
>(
  generateConfig: GenerateConfig<DateType>,
  locale: Locale,
  formatList: FormatType[],
  /** Used for RangePicker. `true` means [DateType, DateType] or will be DateType[] */
  rangeValue: boolean,
  /**
   * Trigger order when trigger calendar value change.
   * This should only used in SinglePicker with `multiple` mode.
   * So when `rangeValue` is `true`, order will be ignored.
   */
  order: boolean,
  defaultValue?: ValueType | null,
  value?: ValueType | null,
  onCalendarChange?: (
    dates: NoUndefinedList<ValueType>,
    dateStrings: ReplaceListType<Required<ValueType>, string>,
    info: BaseInfo,
  ) => void,
  onOk?: (dates: NoUndefinedList<ValueType>) => void,
) {
  // This is the root value which will sync with controlled or uncontrolled value
  const [innerValue, setInnerValue] = useControlledState(defaultValue, value);
  const mergedValue = innerValue || (EMPTY_VALUE as ValueType);

  // ========================= Inner Values =========================
  const [calendarValue, setCalendarValue] = useCalendarValue(mergedValue);

  // ============================ Change ============================
  const [getDateTexts, isSameDates] = useUtil<ValueType, DateType>(
    generateConfig,
    locale,
    formatList,
  );

  const triggerCalendarChange: TriggerCalendarChange<ValueType> = useEvent(
    (nextCalendarValues: ValueType) => {
      let clone = [...nextCalendarValues] as ValueType;

      if (rangeValue) {
        for (let i = 0; i < 2; i += 1) {
          clone[i] = clone[i] || null;
        }
      } else if (order) {
        clone = orderDates(clone.filter((date) => date) as ValueType, generateConfig);
      }

      // Update merged value
      const [isSameMergedDates, isSameStart] = isSameDates(calendarValue(), clone);
      if (!isSameMergedDates) {
        setCalendarValue(clone);

        // Trigger calendar change event
        if (onCalendarChange) {
          const cellTexts = getDateTexts(clone);
          onCalendarChange(clone as NoUndefinedList<ValueType>, cellTexts, {
            range: isSameStart ? 'end' : 'start',
          });
        }
      }
    },
  );

  const triggerOk = () => {
    if (onOk) {
      onOk(calendarValue() as NoUndefinedList<ValueType>);
    }
  };

  return [mergedValue, setInnerValue, calendarValue, triggerCalendarChange, triggerOk] as const;
}

export default function useRangeValue<
  ValueType extends NullableDateType<DateType>[],
  DateType extends object = any,
>(
  info: Pick<RangePickerProps<DateType>, 'generateConfig' | 'locale' | 'order'> & {
    picker: PickerMode;
    allowEmpty?: [boolean, boolean];
    // Method syntax keeps the parameter check bivariant: the public onChange takes no undefined
    // entries, while ValueType still allows them.
    // eslint-disable-next-line @typescript-eslint/method-signature-style
    onChange?(
      dates: ValueType | null,
      dateStrings: ReplaceListType<Required<ValueType>, string> | null,
    ): void;
  },
  mergedValue: ValueType,
  setInnerValue: (nextValue: ValueType) => void,
  getCalendarValue: () => ValueType,
  triggerCalendarChange: TriggerCalendarChange<ValueType>,
  disabled: ReplaceListType<Required<ValueType>, boolean>,
  formatList: FormatType[],
  isInvalidateDate: (date: DateType, info?: { from?: DateType; activeIndex: number }) => boolean,
): [
  /** Trigger `onChange` by check `disabledDate` */
  flushSubmit: (index: number, needTriggerChange: boolean) => void,
  /** Trigger `onChange` directly without check `disabledDate` */
  triggerSubmitChange: (value?: ValueType | null) => boolean,
  /** Reset calendar and submit values back to the committed value */
  resetValue: (index?: number) => void,
] {
  const {
    // MISC
    generateConfig,
    locale,

    picker,

    onChange,

    // Checker
    allowEmpty,
    order,
  } = info;

  const orderOnChange = disabled.some((d) => d) ? false : order;

  // ============================= Util =============================
  const [getDateTexts, isSameDates] = useUtil<ValueType, DateType>(
    generateConfig,
    locale,
    formatList,
  );

  // ============================ Values ============================
  // Used for trigger `onChange` event.
  // Record current value which is wait for submit.
  const [submitValue, setSubmitValue] = useSyncState(mergedValue);

  /** Sync calendarValue & submitValue back with value */
  const syncWithValue = useEvent(() => {
    setSubmitValue(mergedValue);
  });

  React.useEffect(() => {
    syncWithValue();
  }, [mergedValue]);

  // ============================ Submit ============================
  const triggerSubmit = useEvent((nextValue?: ValueType | null) => {
    const isNullValue = nextValue === null;

    let clone = [...(nextValue || submitValue())] as ValueType;

    // Fill null value
    if (isNullValue) {
      const maxLen = Math.max(disabled.length, clone.length);

      for (let i = 0; i < maxLen; i += 1) {
        if (!disabled[i]) {
          clone[i] = null;
        }
      }
    }

    // Only when exist value to sort
    if (orderOnChange && clone[0] && clone[1]) {
      clone = orderDates(clone, generateConfig);
    }

    // Sync `calendarValue`
    triggerCalendarChange(clone);

    // ========= Validate check =========
    const [start, end] = clone;

    // >>> Empty
    const startEmpty = !start;
    const endEmpty = !end;

    const validateEmptyDateRange = allowEmpty
      ? // Validate empty start
        (!startEmpty || allowEmpty[0]) &&
        // Validate empty end
        (!endEmpty || allowEmpty[1])
      : true;

    // >>> Order
    const validateOrder =
      !order ||
      startEmpty ||
      endEmpty ||
      isSame(generateConfig, locale, start, end, picker) ||
      generateConfig.isAfter(end, start);

    // >>> Invalid
    const validateDates =
      // Validate start
      (disabled[0] || !start || !isInvalidateDate(start, { activeIndex: 0 })) &&
      // Validate end
      (disabled[1] || !end || !isInvalidateDate(end, { from: start!, activeIndex: 1 }));
    // >>> Result
    const allPassed =
      // Null value is from clear button
      isNullValue ||
      // Normal check
      (validateEmptyDateRange && validateOrder && validateDates);

    if (allPassed) {
      // Sync value with submit value
      setInnerValue(clone);

      const [isSameMergedDates] = isSameDates(clone, mergedValue);

      // Trigger `onChange` if needed
      if (onChange && !isSameMergedDates) {
        const everyEmpty = clone.every((val) => !val);
        onChange(
          // Return null directly if all date are empty
          isNullValue && everyEmpty ? null : clone,
          everyEmpty ? null : getDateTexts(clone),
        );
      }
    }

    return allPassed;
  });

  // ========================= Flush Submit =========================
  const flushSubmit = useEvent((index: number, needTriggerChange: boolean) => {
    const nextSubmitValue = fillIndex(submitValue(), index, getCalendarValue()[index]);
    setSubmitValue(nextSubmitValue);

    if (needTriggerChange) {
      triggerSubmit();
    }
  });

  const resetValue = useEvent((index?: number) => {
    if (index === undefined) {
      triggerCalendarChange(mergedValue);
      syncWithValue();
      return;
    }

    triggerCalendarChange(fillIndex(getCalendarValue(), index, mergedValue[index]));
    setSubmitValue(fillIndex(submitValue(), index, mergedValue[index]));
  });

  // ============================ Return ============================
  return [flushSubmit, triggerSubmit, resetValue];
}
