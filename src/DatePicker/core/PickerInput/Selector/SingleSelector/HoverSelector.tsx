import * as React from 'react';

import type { PickerRef } from '../../../interface';
import { type HoverStore, useHoverSnapshot } from '../../hooks/useHoverStore';
import SingleSelector, { type SingleSelectorProps } from './index';

export interface HoverSelectorProps<DateType extends object> extends Omit<
  SingleSelectorProps<DateType>,
  'activeHelp' | 'allHelp' | 'value'
> {
  calendarValue: DateType[];
  hoverStore: HoverStore<DateType>;
  ref?: React.Ref<PickerRef>;
}

export default function HoverSelector<DateType extends object = any>({
  calendarValue,
  hoverStore,
  ref,
  ...props
}: HoverSelectorProps<DateType>) {
  const hover = useHoverSnapshot(hoverStore);
  const { multiple } = props;

  const value = React.useMemo(() => {
    if (!multiple && hover.value) return [hover.value];
    return calendarValue.filter((date) => date);
  }, [calendarValue, hover.value, multiple]);

  return (
    <SingleSelector
      {...props}
      activeHelp={!!hover.value}
      allHelp={!!hover.value && hover.source === 'preset'}
      ref={ref}
      value={value}
    />
  );
}
