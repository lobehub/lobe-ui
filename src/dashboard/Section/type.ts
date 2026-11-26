import type { ReactNode } from 'react';

import type { FlexboxProps } from '@/Flex';

import type { SurfaceRenderLink } from '../Surface/type';

export interface SectionProps extends Omit<FlexboxProps, 'title'> {
  desc?: ReactNode;
  extra?: ReactNode;
  /**
   * Context after the title on the same baseline (`variant="a2ui"`): a muted, sentence-case label
   * such as "Overview", never a tracked uppercase kicker above it.
   */
  eyebrow?: ReactNode;
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
  /**
   * `default` is a titled page section; `card` wraps it in a Surface; `a2ui` is the A2UI playground
   * `Section` (15px title with its `eyebrow` after it, a muted description, children 12px apart).
   */
  variant?: 'default' | 'card' | 'a2ui';
}
