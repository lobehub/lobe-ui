import { clsx } from 'clsx';
import * as React from 'react';

import { useMergeRefs } from '@/utils/mergeRefs';

import { useResizeObserver } from '../../hooks/react';
import type {
  RangeTimeProps,
  SharedPickerProps,
  SharedTimeProps,
  ValueDate,
} from '../../interface';
import { toArray } from '../../utils/miscUtil';
import PickerContext from '../context';
import Footer, { type FooterProps } from './Footer';
import PopupPanel, { type PopupPanelProps } from './PopupPanel';
import PresetPanel from './PresetPanel';

export type PopupShowTimeConfig<DateType extends object = any> = Omit<
  RangeTimeProps<DateType>,
  'defaultValue' | 'defaultOpenValue' | 'disabledTime'
> &
  Pick<SharedTimeProps<DateType>, 'disabledTime'>;

export interface PopupProps<DateType extends object = any, PresetValue = DateType>
  extends
    Pick<React.InputHTMLAttributes<HTMLDivElement>, 'onFocus' | 'onBlur'>,
    FooterProps<DateType>,
    PopupPanelProps<DateType> {
  // Range
  activeInfo?: [activeInputLeft: number, activeInputRight: number, selectorWidth: number];
  classNames?: SharedPickerProps['classNames'];

  containerRef?: React.Ref<HTMLDivElement>;
  // Fill
  /** TimePicker or showTime only */
  defaultOpenValue: DateType;
  // Direction
  direction?: 'ltr' | 'rtl';

  isInvalid: (date: DateType | DateType[]) => boolean;
  // Change
  needConfirm: boolean;

  onOk: VoidFunction;

  onPanelMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onPresetHover: (presetValue: PresetValue) => void;
  onPresetSubmit: (presetValue: PresetValue) => void;

  panelRender?: SharedPickerProps['panelRender'];

  // Presets
  presets: ValueDate<DateType>[];
  styles?: SharedPickerProps['styles'];
}

export default function Popup<DateType extends object = any>(props: PopupProps<DateType>) {
  const {
    containerRef,
    panelRender,
    internalMode,
    picker,
    showNow,

    // Range
    range,
    multiple,
    activeInfo = [0, 0, 0],

    // Presets
    presets,
    onPresetHover,
    onPresetSubmit,

    // Focus
    onFocus,
    onBlur,
    onPanelMouseDown,

    // Direction
    direction,

    // Change
    value,
    onSelect,
    isInvalid,
    defaultOpenValue,
    onOk,
    onSubmit,
    classNames,
    styles,
  } = props;

  const { prefixCls } = React.use(PickerContext);
  const panelPrefixCls = `${prefixCls}-panel`;

  const rtl = direction === 'rtl';

  // ========================= Refs =========================
  const arrowRef = React.useRef<HTMLDivElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const panelContainerRef = React.useRef<HTMLDivElement>(null);
  const mergedContainerRef = useMergeRefs([containerRef, panelContainerRef]);

  // ======================== Offset ========================
  const [containerWidth, setContainerWidth] = React.useState<number>(0);
  const [containerOffset, setContainerOffset] = React.useState<number>(0);
  const [arrowOffset, setArrowOffset] = React.useState<number>(0);

  useResizeObserver(
    panelContainerRef,
    (element) => {
      if (element.offsetWidth) {
        setContainerWidth(element.offsetWidth);
      }
    },
    !!range,
  );

  const [activeInputLeft, activeInputRight, selectorWidth] = activeInfo;
  const [retryTimes, setRetryTimes] = React.useState(0);

  React.useEffect(() => {
    setRetryTimes(10);
  }, [activeInputLeft]);

  React.useEffect(() => {
    // `activeOffset` is always align with the active input element
    // So we need only check container contains the `activeOffset`
    if (range && wrapperRef.current) {
      // Offset in case container has border radius
      const arrowWidth = arrowRef.current?.offsetWidth || 0;

      // Arrow Offset
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      if (!wrapperRect.height || wrapperRect.right < 0) {
        setRetryTimes((times) => Math.max(0, times - 1));
        return;
      }

      const nextArrowOffset =
        (rtl ? activeInputRight - arrowWidth : activeInputLeft) - wrapperRect.left;
      setArrowOffset(nextArrowOffset);

      // Container Offset
      if (containerWidth && containerWidth < selectorWidth) {
        const offset = rtl
          ? wrapperRect.right - (activeInputRight - arrowWidth + containerWidth)
          : activeInputLeft + arrowWidth - wrapperRect.left - containerWidth;

        const safeOffset = Math.max(0, offset);
        setContainerOffset(safeOffset);
      } else {
        setContainerOffset(0);
      }
    }
  }, [retryTimes, rtl, containerWidth, activeInputLeft, activeInputRight, selectorWidth, range]);

  // ======================== Custom ========================
  function filterEmpty<T>(list: T[]) {
    return list.filter((item) => item);
  }

  const valueList = React.useMemo(() => filterEmpty(toArray(value)), [value]);

  const isTimePickerEmptyValue = picker === 'time' && !valueList.length;

  const footerSubmitValue = React.useMemo(() => {
    if (isTimePickerEmptyValue) {
      return filterEmpty([defaultOpenValue]);
    }
    return valueList;
  }, [isTimePickerEmptyValue, valueList, defaultOpenValue]);

  const popupPanelValue = isTimePickerEmptyValue ? defaultOpenValue : valueList;

  const disableSubmit = React.useMemo(() => {
    // Empty is invalid
    if (!footerSubmitValue.length) {
      return true;
    }

    return footerSubmitValue.some((val) => isInvalid(val));
  }, [footerSubmitValue, isInvalid]);

  const onFooterSubmit = () => {
    // For TimePicker, we will additional trigger the value update
    if (isTimePickerEmptyValue) {
      onSelect!(defaultOpenValue);
    }

    onOk();
    onSubmit();
  };

  let mergedNodes: React.ReactNode = (
    <div className={`${prefixCls}-panel-layout`}>
      {/* `any` here since PresetPanel is reused for both Single & Range Picker which means return type is not stable */}
      <PresetPanel<any>
        prefixCls={prefixCls}
        presets={presets}
        onClick={onPresetSubmit}
        onHover={onPresetHover}
      />
      <div>
        <PopupPanel {...props} value={popupPanelValue} />
        <Footer
          {...props}
          invalid={disableSubmit}
          showNow={multiple ? false : showNow}
          onSubmit={onFooterSubmit}
        />
      </div>
    </div>
  );

  if (panelRender) {
    mergedNodes = panelRender(mergedNodes);
  }

  // ======================== Render ========================
  const containerPrefixCls = `${panelPrefixCls}-container`;

  const marginLeft = 'marginLeft';
  const marginRight = 'marginRight';

  // Container
  let renderNode = (
    <div
      ref={mergedContainerRef}
      tabIndex={-1}
      className={clsx(
        containerPrefixCls,
        // Used for Today Button style, safe to remove if no need
        `${prefixCls}-${internalMode}-panel-container`,
        classNames?.popup?.container,
      )}
      onBlur={onBlur}
      style={{
        [rtl ? marginRight : marginLeft]: containerOffset,
        [rtl ? marginLeft : marginRight]: 'auto',
        ...styles?.popup?.container,
      }}
      // Still wish not to lose focus on mouse down
      // onMouseDown={(e) => {
      //   // e.preventDefault();
      // }}
      onFocus={onFocus}
      onMouseDown={onPanelMouseDown}
    >
      {mergedNodes}
    </div>
  );

  if (range) {
    renderNode = (
      <div
        className={clsx(`${prefixCls}-range-wrapper`, `${prefixCls}-${picker}-range-wrapper`)}
        ref={wrapperRef}
        onMouseDown={onPanelMouseDown}
      >
        <div className={`${prefixCls}-range-arrow`} ref={arrowRef} style={{ left: arrowOffset }} />

        {/* Watch for container size */}
        {renderNode}
      </div>
    );
  }

  return renderNode;
}
