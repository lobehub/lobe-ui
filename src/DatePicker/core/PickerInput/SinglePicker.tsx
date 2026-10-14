import { clsx } from 'clsx';
import * as React from 'react';

import { useControlledState, useEvent, useLayoutEffect } from '../hooks/react';
import useSemantic from '../hooks/useSemantic';
import useToggleDates from '../hooks/useToggleDates';
import type {
  BaseInfo,
  InternalMode,
  PanelMode,
  PickerRef,
  SelectorProps,
  SharedHTMLAttrs,
  SharedPickerProps,
  SharedTimeProps,
  ValueDate,
} from '../interface';
import PickerPopup from '../PickerPopup';
import { omit, pickAttrs } from '../utils/common';
import { toArray } from '../utils/miscUtil';
import PickerContext from './context';
import useCellRender from './hooks/useCellRender';
import useFieldsInvalidate from './hooks/useFieldsInvalidate';
import useFilledProps from './hooks/useFilledProps';
import useFocusEvents, { isTargetInContainers } from './hooks/useFocusEvents';
import useOpen from './hooks/useOpen';
import usePickerRef from './hooks/usePickerRef';
import usePresets from './hooks/usePresets';
import useRangePickerValue from './hooks/useRangePickerValue';
import useRangeValue, { useInnerValue } from './hooks/useRangeValue';
import useRangeValueChange, { type RangeValueChangeSource } from './hooks/useRangeValueChange';
import useShowNow from './hooks/useShowNow';
import Popup from './Popup';
import SingleSelector from './Selector/SingleSelector';

// TODO: isInvalidateDate with showTime.disabledTime should not provide `range` prop

export interface CustomTagProps<DateType extends object = any> {
  closable: boolean;
  disabled: boolean;
  label: React.ReactNode;
  onClose: (event?: React.MouseEvent<HTMLElement>) => void;
  value: DateType;
}

export interface BasePickerProps<
  DateType extends object = any,
> extends SharedPickerProps<DateType> {
  // Picker Value
  /**
   * Config the popup panel date.
   * Every time active the input to open popup will reset with `defaultPickerValue`.
   *
   * Note: `defaultPickerValue` priority is higher than `value` for the first open.
   */
  defaultPickerValue?: DateType | null;

  defaultValue?: DateType | DateType[];
  // Control
  disabled?: boolean;
  // Structure
  id?: string;
  /** Only works when `multiple` is in use */
  maxTagCount?: number | 'responsive';

  // Mode
  mode?: PanelMode;
  /** Not support `time` or `datetime` picker */
  multiple?: boolean;
  onCalendarChange?: (
    date: DateType | DateType[],
    dateString: string | string[],
    info: BaseInfo,
  ) => void;
  onChange?: (date: DateType | DateType[], dateString: string | string[]) => void;
  /**  */
  onOk?: (value?: DateType | DateType[]) => void;

  onPanelChange?: (values: DateType, modes: PanelMode) => void;

  /**
   * Each popup panel `pickerValue` change will trigger the callback.
   * @param date The changed picker value
   * @param info.source `panel` from the panel click. `reset` from popup open or field typing.
   */
  onPickerValueChange?: (
    date: DateType,
    info: {
      source: 'reset' | 'panel';
      mode: PanelMode;
    },
  ) => void;
  /**
   * Config each start & end field popup panel date.
   * When config `pickerValue`, you must also provide `onPickerValueChange` to handle changes.
   */
  pickerValue?: DateType | null;
  // Placeholder
  placeholder?: string;

  // Preset
  presets?: ValueDate<DateType>[];

  removeIcon?: React.ReactNode;

  /** Only works when `multiple` is in use */
  tagRender?: (props: CustomTagProps<DateType>) => React.ReactNode;
  // Value
  value?: DateType | DateType[] | null;
}

export interface PickerProps<DateType extends object = any>
  extends BasePickerProps<DateType>, Omit<SharedTimeProps<DateType>, 'format' | 'defaultValue'> {}

/** Internal usage. For cross function get same aligned props */
export type ReplacedPickerProps<DateType extends object = any> = {
  value?: DateType[];
  defaultValue?: DateType[];
  pickerValue?: DateType[];
  defaultPickerValue?: DateType[];
  onChange?: (date: DateType | DateType[], dateString: string | string[]) => void;
  onCalendarChange?: (
    date: DateType | DateType[],
    dateString: string | string[],
    info: BaseInfo,
  ) => void;
};

function Picker<DateType extends object = any>(
  props: PickerProps<DateType>,
  ref: React.Ref<PickerRef>,
) {
  // ========================= Prop =========================
  const [filledProps, internalPicker, complexPicker, formatList, maskFormat, isInvalidateDate] =
    useFilledProps(props);

  const {
    // Style
    prefixCls,
    rootClassName,
    styles: propStyles,
    classNames: propClassNames,

    previewValue,

    // Value
    order,
    defaultValue,
    value,
    needConfirm,
    onChange,
    onClear,
    onKeyDown,

    // Disabled
    disabled,
    disabledDate,
    minDate,
    maxDate,

    // Open
    defaultOpen,
    open,
    onOpenChange,

    // Picker
    locale,
    generateConfig,
    picker,
    showNow,
    showToday,
    showTime,

    // Mode
    mode,
    onPanelChange,
    onCalendarChange,
    onOk,
    multiple,

    // Picker Value
    defaultPickerValue,
    pickerValue,
    onPickerValueChange,

    // Format
    inputReadOnly,

    suffixIcon,
    removeIcon,
    tagRender,

    // Focus
    onFocus,
    onBlur,

    // Presets
    presets,

    // Render
    components,
    cellRender,
    dateRender,
    monthCellRender,

    // Native
    onClick,
  } = filledProps as Omit<typeof filledProps, keyof ReplacedPickerProps<DateType>> &
    ReplacedPickerProps<DateType>;

  // ========================= Refs =========================
  const selectorRef = usePickerRef(ref);
  const popupRef = React.useRef<HTMLDivElement>(null);

  // ========================= Util =========================
  function pickerParam<T>(values: T[] | null) {
    if (values === null) {
      return null;
    }

    return multiple ? values : values[0];
  }

  const toggleDates = useToggleDates(generateConfig, locale, internalPicker);

  // ======================= Semantic =======================
  const [mergedClassNames, mergedStyles] = useSemantic(propClassNames, propStyles);

  // ========================= Open =========================
  const [mergedOpen, triggerOpen] = useOpen(open, defaultOpen, [disabled], onOpenChange);

  // ======================= Calendar =======================
  const onInternalCalendarChange = (dates: DateType[], dateStrings: string[], info: BaseInfo) => {
    if (onCalendarChange) {
      const filteredInfo = {
        ...info,
      };
      delete filteredInfo.range;
      onCalendarChange(pickerParam(dates)!, pickerParam(dateStrings)!, filteredInfo);
    }
  };

  const onInternalOk = (dates: DateType[]) => {
    onOk?.(pickerParam(dates)!);
  };

  // ======================== Values ========================
  const [mergedValue, setInnerValue, getCalendarValue, triggerCalendarChange, triggerOk] =
    useInnerValue(
      generateConfig,
      locale,
      formatList,
      false,
      order,
      defaultValue,
      value,
      onInternalCalendarChange,
      onInternalOk,
    );

  const calendarValue = getCalendarValue();

  // ======================== Focus =========================
  const isInternalPickerElement = useEvent((element: EventTarget | null) =>
    isTargetInContainers(element, [selectorRef.current!.nativeElement, popupRef.current]),
  );

  const [focused, onFieldFocus, onFieldBlur] = useFocusEvents(
    isInternalPickerElement,
    (_index, event) => {
      onFocus?.(event, {});
    },
    (_index, event) => {
      onBlur?.(event, {});
    },
    () => {
      triggerOpen(false);
    },
  );

  // ========================= Mode =========================
  const [mergedMode, setMode] = useControlledState(picker, mode);

  /** Extends from `mergedMode` to patch `datetime` mode */
  const internalMode: InternalMode = mergedMode === 'date' && showTime ? 'datetime' : mergedMode;

  // ======================= Show Now =======================
  const mergedShowNow = useShowNow(picker, mergedMode, showNow, showToday);

  // ======================== Value =========================
  const onInternalChange =
    onChange &&
    ((dates: DateType[] | null, dateStrings: string[] | null) => {
      onChange(pickerParam(dates)!, pickerParam(dateStrings)!);
    });

  const [
    ,
    /** Trigger `onChange` directly without check `disabledDate` */
    triggerSubmitChange,
    /** Reset uncommitted values */
    resetValue,
  ] = useRangeValue(
    {
      ...filledProps,
      onChange: onInternalChange,
    },
    mergedValue,
    setInnerValue,
    getCalendarValue,
    triggerCalendarChange,
    [], //disabled,
    formatList,
    isInvalidateDate,
  );

  // Treat the complete SinglePicker value list as one field value. This keeps
  // multiple dates inside field `0` instead of exposing them as extra fields.
  // 将 SinglePicker 的整组值视为一个 field value；multiple 日期仍属于
  // field `0` 内部，不会被当成额外的 field。
  const getFieldCalendarValue = useEvent(() => {
    const values = getCalendarValue();
    return [values.length ? values : null];
  });

  const triggerFieldCalendarChange = useEvent((_index: number, nextValues: DateType[]) => {
    triggerCalendarChange(nextValues);
  });

  const flushFieldSubmit = useEvent((_index: number, needTriggerChange: boolean) => {
    if (needTriggerChange) {
      triggerSubmitChange(getCalendarValue());
      triggerOpen(false, { force: true });
    }
  });

  const resetFieldValue = useEvent(() => {
    resetValue();
  });

  const [, activeIndex, , , triggerSingleValueChange, resetSingleValueChange] = useRangeValueChange<
    DateType[]
  >(
    1,
    needConfirm,
    [false],
    getFieldCalendarValue,
    triggerFieldCalendarChange,
    flushFieldSubmit,
    resetFieldValue,
  );

  // Finalize the current interaction only after the popup is actually closed.
  // 仅在 popup 实际关闭后，统一收口当前交互。
  useLayoutEffect(
    (firstMount) => {
      if (!firstMount && !mergedOpen) {
        triggerSingleValueChange(0, 'popupClose');
      }
    },
    [mergedOpen],
  );

  // ======================= Validate =======================
  const [submitInvalidates, onSelectorInvalid] = useFieldsInvalidate(
    calendarValue,
    isInvalidateDate,
  );

  const submitInvalidate = React.useMemo(
    () => submitInvalidates.some((invalidated) => invalidated),
    [submitInvalidates],
  );

  // ===================== Picker Value =====================
  // Proxy to single pickerValue
  const onInternalPickerValueChange = (
    dates: DateType[],
    info: BaseInfo & { source: 'reset' | 'panel'; mode: [PanelMode, PanelMode] },
  ) => {
    if (onPickerValueChange) {
      const cleanInfo = { ...info, mode: info.mode[0] };
      delete cleanInfo.range;
      onPickerValueChange(dates[0], cleanInfo);
    }
  };

  const [currentPickerValue, setCurrentPickerValue] = useRangePickerValue(
    generateConfig,
    locale,
    calendarValue,
    [mergedMode],
    mergedOpen,
    false,
    activeIndex,
    internalPicker,
    false, // multiplePanel,
    defaultPickerValue,
    pickerValue,
    toArray(showTime?.defaultOpenValue),
    onInternalPickerValueChange,
    minDate,
    maxDate,
  );

  // >>> Mode need wait for `pickerValue`
  const triggerModeChange = useEvent(
    (nextPickerValue: DateType | null, nextMode: PanelMode, triggerEvent?: boolean) => {
      setMode(nextMode);

      // Compatible with `onPanelChange`
      if (onPanelChange && triggerEvent !== false) {
        const lastPickerValue: DateType = nextPickerValue || calendarValue.at(-1)!;
        onPanelChange(lastPickerValue, nextMode);
      }
    },
  );

  // ======================== Submit ========================
  /**
   * Submit the complete value list stored in SinglePicker field `0`.
   * 提交 SinglePicker field `0` 内保存的整组值。
   */
  const triggerConfirm = (source: RangeValueChangeSource = 'confirm') => {
    triggerSingleValueChange(0, source);
  };

  // ======================== Click =========================
  const onSelectorClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (!disabled && !selectorRef.current!.nativeElement.contains(document.activeElement)) {
      // Click to focus the enabled input
      selectorRef.current!.focus();
    }

    triggerOpen(true);

    onClick?.(event);
  };

  const onSelectorClear = () => {
    resetSingleValueChange();
    triggerSubmitChange(null);
    triggerOpen(false, { force: true });
    selectorRef.current!.focus();
    onClear?.();
  };

  // ======================== Hover =========================
  const [hoverSource, setHoverSource] = React.useState<'cell' | 'preset' | null>(null);
  const [internalHoverValue, setInternalHoverValue] = React.useState<DateType | null>(null);

  const hoverValues = React.useMemo(() => {
    const values = [internalHoverValue, ...calendarValue].filter((date) => date);

    return multiple ? values : values.slice(0, 1);
  }, [calendarValue, internalHoverValue, multiple]);

  // Selector values is different with RangePicker
  // which can not use `hoverValue` directly
  const selectorValues = React.useMemo(() => {
    if (!multiple && internalHoverValue) {
      return [internalHoverValue];
    }

    return calendarValue.filter((date) => date);
  }, [calendarValue, internalHoverValue, multiple]);

  // Clean up `internalHoverValues` when closed
  React.useEffect(() => {
    if (!mergedOpen) {
      setInternalHoverValue(null);
    }
  }, [mergedOpen]);

  const onSetHover = (date: DateType | null, source: 'cell' | 'preset') => {
    if (previewValue !== 'hover') {
      return;
    }
    setInternalHoverValue(date);
    setHoverSource(source);
  };

  // ========================================================
  // ==                       Panels                       ==
  // ========================================================
  // ======================= Presets ========================
  const presetList = usePresets(presets);

  const onPresetHover = (nextValue: DateType | null) => {
    onSetHover(nextValue, 'preset');
  };

  // TODO: handle this
  const onPresetSubmit = (nextValue: DateType) => {
    const nextCalendarValues = multiple ? toggleDates(getCalendarValue(), nextValue) : [nextValue];
    const passed = triggerSubmitChange(nextCalendarValues);

    if (passed && !multiple) {
      triggerOpen(false, { force: true });
    }
  };

  const onNow = (now: DateType) => {
    onPresetSubmit(now);
  };

  // ======================== Panel =========================
  const onPanelHover = (date: DateType | null) => {
    onSetHover(date, 'cell');
  };

  // >>> Focus
  const onPanelFocus: React.FocusEventHandler<HTMLElement> = (event) => {
    triggerOpen(true);
    onFieldFocus(0, 'panel', event);
  };

  // >>> Calendar
  const onPanelSelect = (date: DateType) => {
    // Not change values if multiple and current panel is to match with picker
    if (multiple && internalMode !== picker) {
      return;
    }

    const nextValues = multiple ? toggleDates(getCalendarValue(), date) : [date];
    const panelFinished = !complexPicker && internalPicker === internalMode;

    triggerSingleValueChange(0, panelFinished ? 'panel-final' : 'panel-intermediate', nextValues);
  };

  // >>> Close
  const onPopupClose = () => {
    // Close popup
    triggerOpen(false);
  };

  // >>> cellRender
  const onInternalCellRender = useCellRender(cellRender, dateRender, monthCellRender);

  // >>> invalid

  const panelProps = React.useMemo(() => {
    const domProps = pickAttrs(filledProps);
    const restProps = omit(filledProps, [
      ...(Object.keys(domProps) as (keyof SharedHTMLAttrs)[]),
      'onChange',
      'onCalendarChange',
      'onClear',
      'style',
      'className',
      'onPanelChange',
      'classNames',
      'styles',
    ]);
    return {
      ...restProps,
      multiple: filledProps.multiple,
    };
  }, [filledProps]);

  // >>> Render
  const panel = (
    <Popup<any>
      containerRef={popupRef}
      // MISC
      {...panelProps}
      classNames={mergedClassNames}
      isInvalid={isInvalidateDate}
      mode={mergedMode}
      showNow={mergedShowNow}
      styles={mergedStyles}
      value={calendarValue}
      onChange={null}
      onFocus={onPanelFocus}
      onPresetHover={onPresetHover}
      onPresetSubmit={onPresetSubmit}
      onSubmit={() => triggerConfirm('confirm')}
      defaultOpenValue={showTime?.defaultOpenValue}
      // Focus
      internalMode={internalMode}
      showTime={showTime}
      // Disabled
      disabledDate={disabledDate}
      onBlur={(event) => onFieldBlur(0, 'panel', event)}
      // Mode
      picker={picker}
      onHover={onPanelHover}
      // Submit
      needConfirm={needConfirm}
      onNow={onNow}
      // Render
      cellRender={onInternalCellRender}
      onOk={triggerOk}
      // Preset
      presets={presetList}
      onPanelChange={triggerModeChange}
      // Value
      format={maskFormat}
      // Styles
      onPickerValueChange={setCurrentPickerValue}
      // Hover
      hoverValue={hoverValues}
      onSelect={onPanelSelect}
      // PickerValue
      pickerValue={currentPickerValue}
    />
  );

  // ========================================================
  // ==                      Selector                      ==
  // ========================================================

  // ======================== Change ========================
  const onSelectorChange = (date: DateType[], source: 'input' | 'remove' = 'input') => {
    triggerSingleValueChange(0, source, date);
  };

  const onSelectorInputChange = () => {
    triggerSingleValueChange(0, 'input');
  };

  // ======================= Selector =======================
  const onSelectorFocus: SelectorProps['onFocus'] = (event) => {
    triggerSingleValueChange(0, 'field-switch');

    triggerOpen(true, {
      inherit: true,
    });

    onFieldFocus(0, 'input', event);
  };

  const onSelectorBlur: SelectorProps['onBlur'] = (event) => {
    onFieldBlur(0, 'input', event);
  };

  const onSelectorKeyDown: SelectorProps['onKeyDown'] = (event, preventDefault) => {
    if (event.key === 'Tab') {
      triggerConfirm('keyboard-submit-weak');
    } else if (event.key === 'Escape') {
      triggerSingleValueChange(0, 'esc');
      triggerOpen(false);
    }

    onKeyDown?.(event, preventDefault);
  };

  // ======================= Context ========================
  const context = React.useMemo(
    () => ({
      prefixCls,
      locale,
      generateConfig,
      button: components.button,
      input: components.input,
      classNames: mergedClassNames,
      styles: mergedStyles,
    }),
    [
      prefixCls,
      locale,
      generateConfig,
      components.button,
      components.input,
      mergedClassNames,
      mergedStyles,
    ],
  );

  // ======================== Effect ========================
  // >>> Mode
  // Reset for every active
  useLayoutEffect(() => {
    if (mergedOpen && activeIndex !== undefined) {
      // Legacy compatible. This effect update should not trigger `onPanelChange`
      triggerModeChange(null, picker, false);
    }
  }, [mergedOpen, activeIndex, picker]);

  // ======================== Render ========================
  return (
    <PickerContext value={context}>
      <PickerPopup
        direction={filledProps.direction}
        getAnchor={() => selectorRef.current?.nativeElement}
        getPopupContainer={filledProps.getPopupContainer}
        inline={filledProps.inlinePopup}
        placement={filledProps.placement}
        popupElement={panel}
        popupStyle={mergedStyles.popup.root}
        onClose={onPopupClose}
        popupClassName={clsx(rootClassName, mergedClassNames.popup.root)}
        // Visible
        visible={mergedOpen}
      >
        <SingleSelector
          // Shared
          {...filledProps}
          // Ref
          allHelp={!!internalHoverValue && hoverSource === 'preset'}
          focused={focused}
          maskFormat={maskFormat}
          open={mergedOpen}
          removeIcon={removeIcon}
          onBlur={onSelectorBlur}
          onChange={onSelectorChange}
          onFocus={onSelectorFocus}
          onInputChange={onSelectorInputChange}
          onKeyDown={onSelectorKeyDown}
          onInvalid={(invalid) => {
            // Only `single` mode support type date.
            // `multiple` mode can not typing.
            onSelectorInvalid(invalid, 0);
          }}
          inputReadOnly={inputReadOnly}
          // Disabled
          disabled={disabled}
          internalPicker={internalPicker}
          // Format
          format={formatList}
          ref={selectorRef}
          // Style
          className={clsx(filledProps.className, rootClassName, mergedClassNames.root)}
          style={{ ...mergedStyles.root, ...filledProps.style }}
          // Icon
          suffixIcon={suffixIcon}
          // Open
          tagRender={tagRender}
          // Active
          activeHelp={!!internalHoverValue}
          onClear={onSelectorClear}
          // Invalid
          invalid={submitInvalidate}
          onOpenChange={triggerOpen}
          // Click
          onClick={onSelectorClick}
          onSubmit={() => triggerConfirm('keyboard-submit')}
          // Change
          value={selectorValues}
        />
      </PickerPopup>
    </PickerContext>
  );
}

const RefPicker = React.forwardRef(Picker) as <DateType extends object = any>(
  props: PickerProps<DateType> & React.RefAttributes<PickerRef>,
) => React.ReactElement;

if (process.env.NODE_ENV !== 'production') {
  (RefPicker as any).displayName = 'RefPicker';
}

export default RefPicker;
