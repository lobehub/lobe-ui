import { clsx } from 'clsx';
import * as React from 'react';

import type { SharedPanelProps, SharedTimeProps } from '../../../interface';
import { PickerHackContext, usePanelContext } from '../../context';
import TimeColumn from './TimeColumn';
import useTimeState from './useTimeState';

export type TimePanelBodyProps<DateType extends object = any> = SharedPanelProps<DateType>;

export default function TimePanelBody<DateType extends object = any>(
  props: SharedTimeProps<DateType>,
) {
  const {
    showHour,
    showMinute,
    showSecond,
    showMillisecond,
    use12Hours: showMeridiem,
    changeOnScroll,
  } = props;

  const { prefixCls, classNames, styles } = usePanelContext<DateType>();
  const { onCellDblClick } = React.use(PickerHackContext);

  const {
    hour,
    hourUnits,
    meridiem,
    meridiemUnits,
    millisecond,
    millisecondUnits,
    minute,
    minuteUnits,
    onHourChange,
    onHourHover,
    onMeridiemChange,
    onMeridiemHover,
    onMillisecondChange,
    onMillisecondHover,
    onMinuteChange,
    onMinuteHover,
    onSecondChange,
    onSecondHover,
    pickerHour,
    pickerMillisecond,
    pickerMinute,
    pickerSecond,
    second,
    secondUnits,
  } = useTimeState(props);

  // ========================= Render =========================
  const sharedColumnProps = {
    onDblClick: onCellDblClick,
    changeOnScroll,
  };

  return (
    <div className={clsx(`${prefixCls}-content`, classNames.content)} style={styles.content}>
      {showHour && (
        <TimeColumn
          optionalValue={pickerHour}
          type="hour"
          units={hourUnits}
          value={hour}
          onChange={onHourChange}
          onHover={onHourHover}
          {...sharedColumnProps}
        />
      )}
      {showMinute && (
        <TimeColumn
          optionalValue={pickerMinute}
          type="minute"
          units={minuteUnits}
          value={minute}
          onChange={onMinuteChange}
          onHover={onMinuteHover}
          {...sharedColumnProps}
        />
      )}
      {showSecond && (
        <TimeColumn
          optionalValue={pickerSecond}
          type="second"
          units={secondUnits}
          value={second}
          onChange={onSecondChange}
          onHover={onSecondHover}
          {...sharedColumnProps}
        />
      )}
      {showMillisecond && (
        <TimeColumn
          optionalValue={pickerMillisecond}
          type="millisecond"
          units={millisecondUnits}
          value={millisecond}
          onChange={onMillisecondChange}
          onHover={onMillisecondHover}
          {...sharedColumnProps}
        />
      )}
      {showMeridiem && (
        <TimeColumn
          type="meridiem"
          units={meridiemUnits}
          value={meridiem}
          onChange={onMeridiemChange}
          onHover={onMeridiemHover}
          {...sharedColumnProps}
        />
      )}
    </div>
  );
}
