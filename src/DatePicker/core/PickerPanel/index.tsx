import { clsx } from 'clsx';
import * as React from 'react';

import { useControlledState, useEvent } from '../hooks/react';
import useLocale from '../hooks/useLocale';
import { fillShowTimeConfig, getTimeProps } from '../hooks/useTimeConfig';
import useToggleDates from '../hooks/useToggleDates';
import type {
  CellRender,
  Components,
  InternalMode,
  Locale,
  OnPanelChange,
  PanelMode,
  PanelSemanticName,
  PickerMode,
  SharedPanelProps,
  SharedTimeProps,
} from '../interface';
import PickerContext from '../PickerInput/context';
import useCellRender from '../PickerInput/hooks/useCellRender';
import { warning } from '../utils/common';
import { isSame } from '../utils/dateUtil';
import { pickProps, toArray } from '../utils/miscUtil';
import { PickerHackContext, SharedPanelContext } from './context';
import DatePanel from './DatePanel';
import DateTimePanel from './DateTimePanel';
import DecadePanel from './DecadePanel';
import MonthPanel from './MonthPanel';
import QuarterPanel from './QuarterPanel';
import TimePanel from './TimePanel';
import WeekPanel from './WeekPanel';
import YearPanel from './YearPanel';

const DefaultComponents: Components = {
  date: DatePanel,
  datetime: DateTimePanel,
  week: WeekPanel,
  month: MonthPanel,
  quarter: QuarterPanel,
  year: YearPanel,
  decade: DecadePanel,
  time: TimePanel,
};

export interface PickerPanelRef {
  nativeElement: HTMLDivElement;
}

export interface BasePickerPanelProps<DateType extends object = any>
  extends
    Pick<
      SharedPanelProps<DateType>,
      // MISC
      | 'locale'
      | 'generateConfig'

      // Disabled
      | 'disabledDate'
      | 'minDate'
      | 'maxDate'

      // Icon
      | 'prevIcon'
      | 'nextIcon'
      | 'superPrevIcon'
      | 'superNextIcon'
    >,
    Omit<SharedTimeProps<DateType>, 'format'>,
    Pick<React.HTMLAttributes<HTMLDivElement>, 'tabIndex'> {
  // Cell
  cellRender?: CellRender<DateType>;

  // Components
  components?: Components;

  /** @deprecated use cellRender instead of dateRender */
  dateRender?: (currentDate: DateType, today: DateType) => React.ReactNode;

  // Panel control
  defaultPickerValue?: DateType | null;

  direction?: 'ltr' | 'rtl';
  format?: string | null;
  /** @private This is internal usage. Do not use in your production env */
  hideHeader?: boolean;

  /** @private Used for Picker passing */
  hoverRangeValue?: [start: DateType, end: DateType] | null;
  // Hover
  /** @private Used for Picker passing */
  hoverValue?: DateType[] | null;
  // Mode
  mode?: PanelMode;

  /** @deprecated use cellRender instead of monthCellRender */
  monthCellRender?: (currentDate: DateType, locale: Locale) => React.ReactNode;

  /** @private Used for Picker passing */
  onHover?: (date: DateType | null) => void;

  /**
   * Compatible with origin API.
   * Not mean the PickerPanel `onChange` event.
   */
  onPanelChange?: OnPanelChange<DateType>;

  onPickerValueChange?: (date: DateType) => void;
  // Value
  onSelect?: (date: DateType) => void;

  picker?: PickerMode;
  pickerValue?: DateType | null;
  // Style
  prefixCls?: string;

  // Time
  showTime?: true | SharedTimeProps<DateType> | null;

  // Week
  /**
   * Only worked in `date` mode. Show the current week
   */
  showWeek?: boolean;
}

export interface SinglePickerPanelProps<DateType extends object = any> extends Omit<
  BasePickerPanelProps<DateType>,
  'defaultValue'
> {
  defaultValue?: DateType | null;

  multiple?: false;
  onChange?: (date: DateType) => void;
  value?: DateType | null;
}

export type PickerPanelProps<DateType extends object = any> = BasePickerPanelProps<DateType> & {
  /** multiple selection. Not support time or datetime picker */
  multiple?: boolean;

  defaultValue?: DateType | DateType[] | null;
  value?: DateType | DateType[] | null;
  onChange?: ((date: DateType | DateType[]) => void) | null;
  styles?: Partial<Record<PanelSemanticName, React.CSSProperties>>;
  classNames?: Partial<Record<PanelSemanticName, string>>;
};

function PickerPanel<DateType extends object = any>(
  props: PickerPanelProps<DateType>,
  ref: React.Ref<PickerPanelRef>,
) {
  const {
    classNames: panelClassNames,
    styles: panelStyles,

    locale,
    generateConfig,

    direction,

    // Style
    prefixCls,
    tabIndex = 0,

    // Value
    multiple,
    defaultValue,
    value,
    onChange,
    onSelect,

    // Picker control
    defaultPickerValue,
    pickerValue,
    onPickerValueChange,

    // Mode
    mode,
    onPanelChange,
    picker = 'date',
    showTime,

    // Hover
    hoverValue,
    hoverRangeValue,

    // Cell
    cellRender,
    dateRender,
    monthCellRender,

    // Components
    components = {},

    hideHeader,
  } = props;

  // ======================== Context ========================
  const {
    prefixCls: contextPrefixCls,
    classNames: pickerClassNames,
    styles: pickerStyles,
  } = React.use(PickerContext) || {};

  // ======================== prefixCls ========================
  const mergedPrefixCls = contextPrefixCls || prefixCls || 'rc-picker';

  // ========================== Refs ==========================
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => ({
    nativeElement: rootRef.current!,
  }));

  // ========================== Time ==========================
  // Auto `format` need to check `showTime.showXXX` first.
  // And then merge the `locale` into `mergedShowTime`.
  const [timeProps, localeTimeProps, showTimeFormat, propFormat] = getTimeProps(props);

  // ========================= Locale =========================
  const filledLocale = useLocale(locale, localeTimeProps);

  // ========================= Picker =========================
  const internalPicker: InternalMode = picker === 'date' && showTime ? 'datetime' : picker;

  // ======================== ShowTime ========================
  const mergedShowTime = React.useMemo(
    () => fillShowTimeConfig(internalPicker, showTimeFormat, propFormat, timeProps, filledLocale),
    [internalPicker, showTimeFormat, propFormat, timeProps, filledLocale],
  );

  // ========================== Now ===========================
  const now = generateConfig.getNow();

  // ========================== Mode ==========================
  const [mergedMode, setMergedMode] = useControlledState<PanelMode>(picker || 'date', mode);

  const internalMode: InternalMode =
    mergedMode === 'date' && mergedShowTime ? 'datetime' : mergedMode;

  // ========================= Toggle =========================
  const toggleDates = useToggleDates(generateConfig, locale, internalPicker);

  // ========================= Value ==========================
  // >>> Real value
  // Interactive with `onChange` event which only trigger when the `mode` is `picker`
  const [innerValue, setMergedValue] = useControlledState(defaultValue, value);

  const mergedValue = React.useMemo(() => {
    // Clean up `[null]`
    const values = toArray(innerValue).filter((val): val is DateType => !!val);
    return multiple ? values : values.slice(0, 1);
  }, [innerValue, multiple]);

  // Sync value and only trigger onChange event when changed
  const triggerChange = useEvent((nextValue: DateType[]) => {
    setMergedValue(nextValue);

    if (
      onChange &&
      (nextValue === null ||
        mergedValue.length !== nextValue.length ||
        mergedValue.some(
          (ori, index) => !isSame(generateConfig, locale, ori, nextValue[index], internalPicker),
        ))
    ) {
      onChange?.(multiple ? nextValue : nextValue[0]);
    }
  });

  // >>> CalendarValue
  // CalendarValue is a temp value for user operation
  // which will only trigger `onCalendarChange` but not `onChange`
  const onInternalSelect = useEvent((newDate: DateType) => {
    onSelect?.(newDate);

    if (mergedMode === picker) {
      const nextValues = multiple ? toggleDates(mergedValue, newDate) : [newDate];

      triggerChange(nextValues);
    }
  });

  // >>> PickerValue
  // PickerValue is used to control the current displaying panel
  const [mergedPickerValue, setInternalPickerValue] = useControlledState(
    defaultPickerValue || mergedValue[0] || now,
    pickerValue,
  );

  React.useEffect(() => {
    if (mergedValue[0] && !pickerValue) {
      setInternalPickerValue(mergedValue[0]);
    }
  }, [mergedValue[0]]);

  // Both trigger when manually pickerValue or mode change
  const triggerPanelChange = (viewDate?: DateType, nextMode?: PanelMode) => {
    onPanelChange?.((viewDate || pickerValue)!, nextMode || mergedMode);
  };

  const setPickerValue = (nextPickerValue: DateType, triggerPanelEvent = false) => {
    setInternalPickerValue(nextPickerValue);

    onPickerValueChange?.(nextPickerValue);

    if (triggerPanelEvent) {
      triggerPanelChange(nextPickerValue);
    }
  };

  const triggerModeChange = (nextMode: PanelMode, viewDate?: DateType) => {
    setMergedMode(nextMode);

    if (viewDate) {
      setPickerValue(viewDate);
    }

    triggerPanelChange(viewDate, nextMode);
  };

  const onPanelValueSelect = (nextValue: DateType) => {
    onInternalSelect(nextValue);
    setPickerValue(nextValue);

    // Update mode if needed
    if (mergedMode !== picker) {
      const decadeYearQueue: PanelMode[] = ['decade', 'year'];
      const decadeYearMonthQueue: PanelMode[] = [...decadeYearQueue, 'month'];

      const pickerQueue: Partial<Record<PickerMode, PanelMode[]>> = {
        quarter: [...decadeYearQueue, 'quarter'],
        week: [...decadeYearMonthQueue, 'week'],
        date: [...decadeYearMonthQueue, 'date'],
      };

      const queue = pickerQueue[picker] || decadeYearMonthQueue;
      const index = queue.indexOf(mergedMode);
      const nextMode = queue[index + 1];

      if (nextMode) {
        triggerModeChange(nextMode, nextValue);
      }
    }
  };

  // ======================= Hover Date =======================
  const hoverRangeDate = React.useMemo<[DateType, DateType] | null>(() => {
    let start: DateType | null | undefined;
    let end: DateType | null | undefined;

    if (Array.isArray(hoverRangeValue)) {
      [start, end] = hoverRangeValue;
    } else {
      start = hoverRangeValue;
    }

    // Return for not exist
    if (!start && !end) {
      return null;
    }

    // Fill if has empty
    start = start || end;
    end = end || start;

    return generateConfig.isAfter(start!, end!) ? [end!, start!] : [start!, end!];
  }, [hoverRangeValue, generateConfig]);

  // ======================= Components =======================
  // >>> cellRender
  const onInternalCellRender = useCellRender(cellRender, dateRender, monthCellRender);

  // ======================= Components =======================
  const PanelComponent = (components[internalMode] ||
    DefaultComponents[internalMode] ||
    DatePanel) as typeof DatePanel;

  // ======================== Context =========================
  const sharedPanelContext = React.useMemo(
    () => ({
      classNames: pickerClassNames?.popup ?? panelClassNames ?? {},
      styles: pickerStyles?.popup ?? panelStyles ?? {},
    }),
    [pickerClassNames, panelClassNames, pickerStyles, panelStyles],
  );

  const parentHackContext = React.use(PickerHackContext);
  const pickerPanelContext = React.useMemo(
    () => ({
      ...parentHackContext,
      hideHeader,
    }),
    [parentHackContext, hideHeader],
  );

  // ======================== Warnings ========================
  if (process.env.NODE_ENV !== 'production') {
    warning(
      !mergedValue || mergedValue.every((val) => generateConfig.isValidate(val)),
      'Invalidate date pass to `value` or `defaultValue`.',
    );
  }

  // ========================= Render =========================
  const panelCls = `${mergedPrefixCls}-panel`;

  const panelProps = pickProps(props, [
    // Week
    'showWeek',

    // Icons
    'prevIcon',
    'nextIcon',
    'superPrevIcon',
    'superNextIcon',

    // Disabled
    'disabledDate',
    'minDate',
    'maxDate',

    // Hover
    'onHover',
  ]);

  return (
    <SharedPanelContext value={sharedPanelContext}>
      <PickerHackContext value={pickerPanelContext}>
        <div
          className={clsx(panelCls, { [`${panelCls}-rtl`]: direction === 'rtl' })}
          ref={rootRef}
          tabIndex={tabIndex}
        >
          <PanelComponent
            {...panelProps}
            // Time
            hoverRangeValue={hoverRangeDate}
            hoverValue={hoverValue}
            value={mergedValue[0]}
            onSelect={onPanelValueSelect}
            onPickerValueChange={(nextPickerValue) => {
              setPickerValue(nextPickerValue, true);
            }}
            generateConfig={generateConfig}
            // Mode
            onModeChange={triggerModeChange}
            locale={filledLocale}
            // Value
            pickerValue={mergedPickerValue!}
            // Hover
            showTime={mergedShowTime}
            // MISC
            prefixCls={mergedPrefixCls}
            values={mergedValue}
            // Render
            cellRender={onInternalCellRender}
          />
        </div>
      </PickerHackContext>
    </SharedPanelContext>
  );
}

const RefPanelPicker = React.memo(React.forwardRef(PickerPanel));

if (process.env.NODE_ENV !== 'production') {
  RefPanelPicker.displayName = 'PanelPicker';
}

// Make support generic
export default RefPanelPicker as <DateType extends object = any>(
  props: PickerPanelProps<DateType> & React.RefAttributes<PickerPanelRef>,
) => React.ReactElement;
