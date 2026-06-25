'use client';

import {
  SegmentedIndicator,
  SegmentedItem,
  SegmentedItemLabel,
  SegmentedRoot,
} from '@lobehub/ui/base-ui';
import { useLayoutEffect, useRef, useState } from 'react';

export default () => {
  const [value, setValue] = useState<string[]>(['daytime']);
  const listRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector<HTMLElement>('[data-segmented-item][data-pressed]');
    if (!active) return;
    list.style.setProperty('--active-item-left', `${active.offsetLeft}px`);
    list.style.setProperty('--active-item-top', `${active.offsetTop}px`);
    list.style.setProperty('--active-item-width', `${active.offsetWidth}px`);
    list.style.setProperty('--active-item-height', `${active.offsetHeight}px`);
  }, [value]);

  return (
    <SegmentedRoot
      ref={listRef}
      value={value}
      variant="filled"
      onValueChange={(next) => {
        if (next[0]) setValue(next);
      }}
    >
      <SegmentedIndicator />
      <SegmentedItem data-segmented-item="" size="middle" value="daytime">
        <SegmentedItemLabel>Daytime</SegmentedItemLabel>
      </SegmentedItem>
      <SegmentedItem data-segmented-item="" size="middle" value="light">
        <SegmentedItemLabel>Light</SegmentedItemLabel>
      </SegmentedItem>
      <SegmentedItem data-segmented-item="" size="middle" value="dark">
        <SegmentedItemLabel>Dark</SegmentedItemLabel>
      </SegmentedItem>
    </SegmentedRoot>
  );
};
