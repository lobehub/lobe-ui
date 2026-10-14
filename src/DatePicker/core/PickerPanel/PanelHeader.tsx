import { clsx } from 'clsx';
import * as React from 'react';

import { isSameOrAfter } from '../utils/dateUtil';
import { PickerHackContext, usePanelContext } from './context';

const HIDDEN_STYLE: React.CSSProperties = {
  visibility: 'hidden',
};

export interface HeaderProps<DateType extends object> {
  children?: React.ReactNode;
  getEnd?: (date: DateType) => DateType;
  // Limitation
  getStart?: (date: DateType) => DateType;

  offset?: (distance: number, date: DateType) => DateType;
  onChange?: (date: DateType) => void;

  superOffset?: (distance: number, date: DateType) => DateType;
}

function PanelHeader<DateType extends object>(props: HeaderProps<DateType>) {
  const {
    offset,
    superOffset,
    onChange,

    getStart,
    getEnd,

    children,
  } = props;

  const {
    prefixCls,
    classNames,
    styles,

    // Icons
    prevIcon = '\u2039',
    nextIcon = '\u203A',
    superPrevIcon = '\u00AB',
    superNextIcon = '\u00BB',

    // Limitation
    minDate,
    maxDate,
    generateConfig,
    locale,
    pickerValue,
    panelType: type,
  } = usePanelContext<DateType>();

  const headerPrefixCls = `${prefixCls}-header`;

  const { hidePrev, hideNext, hideHeader } = React.use(PickerHackContext);

  // ======================= Limitation =======================
  const disabledOffsetPrev = React.useMemo(() => {
    if (!minDate || !offset || !getEnd) {
      return false;
    }

    const prevPanelLimitDate = getEnd(offset(-1, pickerValue));

    return !isSameOrAfter(generateConfig, locale, prevPanelLimitDate, minDate, type);
  }, [minDate, offset, pickerValue, getEnd, generateConfig, locale, type]);

  const disabledSuperOffsetPrev = React.useMemo(() => {
    if (!minDate || !superOffset || !getEnd) {
      return false;
    }

    const prevPanelLimitDate = getEnd(superOffset(-1, pickerValue));

    return !isSameOrAfter(generateConfig, locale, prevPanelLimitDate, minDate, type);
  }, [minDate, superOffset, pickerValue, getEnd, generateConfig, locale, type]);

  const disabledOffsetNext = React.useMemo(() => {
    if (!maxDate || !offset || !getStart) {
      return false;
    }

    const nextPanelLimitDate = getStart(offset(1, pickerValue));

    return !isSameOrAfter(generateConfig, locale, maxDate, nextPanelLimitDate, type);
  }, [maxDate, offset, pickerValue, getStart, generateConfig, locale, type]);

  const disabledSuperOffsetNext = React.useMemo(() => {
    if (!maxDate || !superOffset || !getStart) {
      return false;
    }

    const nextPanelLimitDate = getStart(superOffset(1, pickerValue));

    return !isSameOrAfter(generateConfig, locale, maxDate, nextPanelLimitDate, type);
  }, [maxDate, superOffset, pickerValue, getStart, generateConfig, locale, type]);

  // ========================= Offset =========================
  const onOffset = (distance: number) => {
    if (offset) {
      onChange!(offset(distance, pickerValue));
    }
  };

  const onSuperOffset = (distance: number) => {
    if (superOffset) {
      onChange!(superOffset(distance, pickerValue));
    }
  };

  // ========================= Render =========================
  if (hideHeader) {
    return null;
  }

  const prevBtnCls = `${headerPrefixCls}-prev-btn`;
  const nextBtnCls = `${headerPrefixCls}-next-btn`;
  const superPrevBtnCls = `${headerPrefixCls}-super-prev-btn`;
  const superNextBtnCls = `${headerPrefixCls}-super-next-btn`;

  return (
    <div className={clsx(headerPrefixCls, classNames.header)} style={styles.header}>
      {superOffset && (
        <button
          aria-label={locale.previousYear}
          disabled={disabledSuperOffsetPrev}
          style={hidePrev ? HIDDEN_STYLE : {}}
          tabIndex={-1}
          type="button"
          className={clsx(
            superPrevBtnCls,
            disabledSuperOffsetPrev && `${superPrevBtnCls}-disabled`,
          )}
          onClick={() => onSuperOffset(-1)}
        >
          {superPrevIcon}
        </button>
      )}
      {offset && (
        <button
          aria-label={locale.previousMonth}
          className={clsx(prevBtnCls, disabledOffsetPrev && `${prevBtnCls}-disabled`)}
          disabled={disabledOffsetPrev}
          style={hidePrev ? HIDDEN_STYLE : {}}
          tabIndex={-1}
          type="button"
          onClick={() => onOffset(-1)}
        >
          {prevIcon}
        </button>
      )}
      <div className={`${headerPrefixCls}-view`}>{children}</div>
      {offset && (
        <button
          aria-label={locale.nextMonth}
          className={clsx(nextBtnCls, disabledOffsetNext && `${nextBtnCls}-disabled`)}
          disabled={disabledOffsetNext}
          style={hideNext ? HIDDEN_STYLE : {}}
          tabIndex={-1}
          type="button"
          onClick={() => onOffset(1)}
        >
          {nextIcon}
        </button>
      )}
      {superOffset && (
        <button
          aria-label={locale.nextYear}
          disabled={disabledSuperOffsetNext}
          style={hideNext ? HIDDEN_STYLE : {}}
          tabIndex={-1}
          type="button"
          className={clsx(
            superNextBtnCls,
            disabledSuperOffsetNext && `${superNextBtnCls}-disabled`,
          )}
          onClick={() => onSuperOffset(1)}
        >
          {superNextIcon}
        </button>
      )}
    </div>
  );
}

export default PanelHeader;
