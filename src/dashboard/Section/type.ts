import type { ReactNode } from 'react';

import type { FlexboxProps } from '@/Flex';

import type { SurfaceRenderLink } from '../Surface/type';

export interface SectionProps extends Omit<FlexboxProps, 'title'> {
  desc?: ReactNode;
  extra?: ReactNode;
  fontSize?: number;
  icon?: ReactNode;
  /** Text of the "more" link. */
  more?: ReactNode;
  /** Target of the "more" link. An `http` URL opens in a new tab. */
  moreLink?: string;
  /** Card body padding (`variant="card"`). Turn off when the children already sit on the card edge. */
  padded?: boolean;
  renderLink?: SurfaceRenderLink;
  title?: ReactNode;
  /** `default` is a titled page section; `card` wraps it in a Surface. */
  variant?: 'default' | 'card';
}
