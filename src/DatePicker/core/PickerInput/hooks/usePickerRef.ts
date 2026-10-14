import * as React from 'react';

import type { PickerRef } from '../../interface';

type PickerRefType<OptionType> = Omit<PickerRef, 'focus'> & {
  focus: (options?: OptionType) => void;
};

export default function usePickerRef<
  OptionType,
  SelectorRefType extends PickerRefType<OptionType> = PickerRefType<OptionType>,
>(ref: React.Ref<PickerRefType<OptionType>>) {
  const selectorRef = React.useRef<SelectorRefType>(null);

  React.useImperativeHandle(ref, () => ({
    nativeElement: selectorRef.current?.nativeElement as HTMLDivElement,
    focus: (options) => {
      selectorRef.current?.focus(options);
    },
    blur: () => {
      selectorRef.current?.blur();
    },
  }));

  return selectorRef;
}
