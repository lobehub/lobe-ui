import { useState } from 'react';

import { useEventCallback } from '@/hooks/useEventCallback';

import type { ProTableDensity } from '../type';

export const useDensity = (
  size: ProTableDensity | undefined,
  defaultSize: ProTableDensity | undefined,
  onSizeChange: ((size: ProTableDensity) => void) | undefined,
) => {
  const [innerSize, setInnerSize] = useState<ProTableDensity>(defaultSize ?? 'middle');
  const setSize = useEventCallback((next: ProTableDensity) => {
    setInnerSize(next);
    onSizeChange?.(next);
  });
  return [size ?? innerSize, setSize] as const;
};
