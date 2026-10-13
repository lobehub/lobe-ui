import type { ReactNode } from 'react';

import type { FlexboxProps } from '@/Flex';

export interface LabelWithKeyProps extends Omit<FlexboxProps, 'title'> {
  /** The machine key shown as a tag after the label, e.g. a config or permission id. */
  tag: ReactNode;
  title: ReactNode;
}
