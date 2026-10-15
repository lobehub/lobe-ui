import * as React from 'react';

import useLocale from '../../hooks/useLocale';
import { fillShowTimeConfig, getTimeProps } from '../../hooks/useTimeConfig';
import type {
  Components,
  DisabledDate,
  FormatType,
  InternalMode,
  PickerMode,
} from '../../interface';
import { warning } from '../../utils/common';
import { toArray } from '../../utils/miscUtil';
import type { RangePickerProps } from '../RangePicker';
import { fillClearIcon } from '../Selector/hooks/useClearIcon';
import useDisabledBoundary from './useDisabledBoundary';
import { useFieldFormat } from './useFieldFormat';
import useInputReadOnly from './useInputReadOnly';
import useInvalidate from './useInvalidate';

type UseInvalidate<DateType extends object = any> = typeof useInvalidate<DateType>;

type PickedProps<DateType extends object = any> = Pick<
  RangePickerProps<DateType>,
  | 'generateConfig'
  | 'locale'
  | 'picker'
  | 'prefixCls'
  | 'styles'
  | 'classNames'
  | 'order'
  | 'components'
  | 'inputRender'
  | 'clearIcon'
  | 'allowClear'
  | 'needConfirm'
  | 'format'
  | 'inputReadOnly'
  | 'disabledDate'
  | 'minDate'
  | 'maxDate'
  | 'defaultOpenValue'
  | 'previewValue'
> & {
  multiple?: boolean;
  // RangePicker showTime definition is different with Picker
  showTime?: any;
  value?: any;
  defaultValue?: any;
  pickerValue?: any;
  defaultPickerValue?: any;
};

type ExcludeBooleanType<T> = T extends boolean ? never : T;

type GetGeneric<T> = T extends PickedProps<infer U> ? U : never;

type ToArrayType<T, DateType> = T extends any[] ? T : DateType[];

type ToArrayValueType<T, DateType> = ToArrayType<NonNullable<T>, DateType>;

function useList<T>(value: T | T[], fillMode = false) {
  const values = React.useMemo(() => {
    const list = value ? toArray(value) : (value as null | undefined);

    if (fillMode && list) {
      list[1] = list[1] || list[0];
    }

    return list;
  }, [value, fillMode]);
  return values;
}

/**
 * Align the outer props with unique typed and fill undefined props.
 * This is shared with both RangePicker and Picker. This will do:
 * - Convert `value` & `defaultValue` to array
 * - handle the legacy props fill like `clearIcon` + `allowClear` = `clearIcon`
 */
export default function useFilledProps<
  InProps extends PickedProps,
  DateType extends GetGeneric<InProps>,
  UpdaterProps extends object,
>(
  props: InProps,
  updater?: () => UpdaterProps,
): [
  filledProps: Omit<
    InProps,
    | keyof UpdaterProps
    | 'showTime'
    | 'value'
    | 'defaultValue'
    | 'pickerValue'
    | 'defaultPickerValue'
  > &
    UpdaterProps & {
      picker: PickerMode;
      prefixCls: string;
      order: boolean;
      needConfirm: boolean;
      disabledDate: DisabledDate<DateType>;
      components: Components<DateType>;
      showTime?: ExcludeBooleanType<InProps['showTime']>;
      value?: ToArrayValueType<InProps['value'], DateType>;
      defaultValue?: ToArrayValueType<InProps['value'], DateType>;
      pickerValue?: ToArrayValueType<InProps['pickerValue'], DateType>;
      defaultPickerValue?: ToArrayValueType<InProps['defaultPickerValue'], DateType>;
    },
  internalPicker: InternalMode,
  complexPicker: boolean,
  formatList: FormatType<DateType>[],
  maskFormat: string | null | undefined,
  isInvalidateDate: ReturnType<UseInvalidate<DateType>>,
] {
  const {
    generateConfig,
    locale,
    picker = 'date',
    prefixCls = 'rc-picker',
    previewValue = 'hover',
    styles = {},
    classNames = {},
    order = true,
    components = {},
    inputRender,
    allowClear,
    clearIcon,
    needConfirm,
    multiple,
    format,
    inputReadOnly,
    disabledDate,
    minDate,
    maxDate,
    showTime,

    value,
    defaultValue,
    pickerValue,
    defaultPickerValue,
  } = props;

  const values = useList(value);
  const defaultValues = useList(defaultValue);
  const pickerValues = useList(pickerValue);
  const defaultPickerValues = useList(defaultPickerValue);

  // ======================== Picker ========================
  /** Almost same as `picker`, but add `datetime` for `date` with `showTime` */
  const internalPicker: InternalMode = picker === 'date' && showTime ? 'datetime' : picker;

  /** The picker is `datetime` or `time` */
  const multipleInteractivePicker = internalPicker === 'time' || internalPicker === 'datetime';
  const complexPicker = multipleInteractivePicker || !!multiple;
  const mergedNeedConfirm = needConfirm ?? multipleInteractivePicker;

  // ========================== Time ==========================
  // Auto `format` need to check `showTime.showXXX` first.
  // And then merge the `locale` into `mergedShowTime`.
  const [timeProps, localeTimeProps, showTimeFormat, propFormat] = getTimeProps(props);

  // ======================= Locales ========================
  const mergedLocale = useLocale(locale, localeTimeProps);

  const mergedShowTime = React.useMemo(
    () => fillShowTimeConfig(internalPicker, showTimeFormat, propFormat, timeProps, mergedLocale),
    [internalPicker, showTimeFormat, propFormat, timeProps, mergedLocale],
  );

  // ======================= Warning ========================
  if (
    process.env.NODE_ENV !== 'production' &&
    picker === 'time' &&
    ['disabledHours', 'disabledMinutes', 'disabledSeconds'].some((key) => (props as any)[key])
  ) {
    warning(
      false,
      `'disabledHours', 'disabledMinutes', 'disabledSeconds' will be removed in the next major version, please use 'disabledTime' instead.`,
    );
  }

  // ======================== Props =========================
  const filledProps = React.useMemo(
    () => ({
      ...props,
      previewValue,
      prefixCls,
      locale: mergedLocale,
      picker,
      styles,
      classNames,
      order,
      components: { input: inputRender, ...components },
      clearIcon: fillClearIcon(prefixCls, allowClear, clearIcon),
      showTime: mergedShowTime,
      value: values,
      defaultValue: defaultValues,
      pickerValue: pickerValues,
      defaultPickerValue: defaultPickerValues,
      ...(updater?.() as UpdaterProps),
    }),
    [props],
  );

  // ======================== Format ========================
  const [formatList, maskFormat] = useFieldFormat<DateType>(internalPicker, mergedLocale, format);

  // ======================= ReadOnly =======================
  const mergedInputReadOnly = useInputReadOnly(formatList, inputReadOnly, multiple);

  // ======================= Boundary =======================
  const disabledBoundaryDate = useDisabledBoundary(
    generateConfig,
    locale,
    disabledDate,
    minDate,
    maxDate,
  );

  // ====================== Invalidate ======================
  const isInvalidateDate = useInvalidate(
    generateConfig,
    picker,
    disabledBoundaryDate,
    mergedShowTime,
  );

  // ======================== Merged ========================
  const mergedProps = React.useMemo(
    () => ({
      ...filledProps,
      needConfirm: mergedNeedConfirm,
      inputReadOnly: mergedInputReadOnly,
      disabledDate: disabledBoundaryDate,
    }),
    [filledProps, mergedNeedConfirm, mergedInputReadOnly, disabledBoundaryDate],
  );

  return [mergedProps, internalPicker, complexPicker, formatList, maskFormat, isInvalidateDate];
}
