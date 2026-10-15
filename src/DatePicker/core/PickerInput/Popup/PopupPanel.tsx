import * as React from 'react';

import PickerPanel, { type PickerPanelProps } from '../../PickerPanel';
import { PickerHackContext, type PickerHackContextProps } from '../../PickerPanel/context';
import PickerContext from '../context';
import { offsetPanelDate } from '../hooks/useRangePickerValue';
import { type FooterProps } from './Footer';

export type MustProp<DateType extends object> = Required<
  Pick<PickerPanelProps<DateType>, 'mode' | 'onPanelChange'>
>;

export type PopupPanelProps<DateType extends object = any> = MustProp<DateType> &
  Omit<PickerPanelProps<DateType>, 'onPickerValueChange' | 'showTime'> &
  FooterProps<DateType> & {
    multiplePanel?: boolean;
    range?: boolean;

    onPickerValueChange: (date: DateType) => void;
  };

export default function PopupPanel<DateType extends object = any>(
  props: PopupPanelProps<DateType>,
) {
  const {
    picker,
    multiplePanel,
    pickerValue,
    onPickerValueChange,
    needConfirm,
    onSubmit,
    range,
    hoverValue,
    hoverRangeValue,
  } = props;
  const { prefixCls, generateConfig } = React.use(PickerContext);

  // ======================== Offset ========================
  const internalOffsetDate = React.useCallback(
    (date: DateType, offset: number) => {
      return offsetPanelDate(generateConfig, picker!, date, offset);
    },
    [generateConfig, picker],
  );

  const nextPickerValue = React.useMemo(
    () => internalOffsetDate(pickerValue!, 1),
    [pickerValue, internalOffsetDate],
  );

  // Outside
  const onSecondPickerValueChange = (nextDate: DateType) => {
    onPickerValueChange(internalOffsetDate(nextDate, -1));
  };

  // ======================= Context ========================
  const sharedContext: PickerHackContextProps = {
    onCellDblClick: () => {
      if (needConfirm) {
        onSubmit();
      }
    },
  };

  const hideHeader = picker === 'time';

  // ======================== Props =========================
  const pickerProps: PickerPanelProps<DateType> = {
    ...props,
    hoverRangeValue: null,
    hideHeader,
    hoverValue,
  };

  if (range) {
    pickerProps.hoverRangeValue = hoverRangeValue;
  }

  // ======================== Render ========================
  // Multiple
  if (multiplePanel) {
    return (
      <div className={`${prefixCls}-panels`}>
        <PickerHackContext
          value={{
            ...sharedContext,
            hideNext: true,
          }}
        >
          <PickerPanel<DateType> {...pickerProps} />
        </PickerHackContext>
        <PickerHackContext
          value={{
            ...sharedContext,
            hidePrev: true,
          }}
        >
          <PickerPanel<DateType>
            {...pickerProps}
            pickerValue={nextPickerValue}
            onPickerValueChange={onSecondPickerValueChange}
          />
        </PickerHackContext>
      </div>
    );
  }

  // Single
  return (
    <PickerHackContext
      value={{
        ...sharedContext,
      }}
    >
      <PickerPanel {...pickerProps} />
    </PickerHackContext>
  );
}
