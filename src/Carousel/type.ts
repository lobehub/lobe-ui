import type { ComponentProps, ReactNode, Ref } from 'react';

export interface CarouselRef {
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
}

export interface CarouselProps extends Omit<ComponentProps<'div'>, 'children' | 'ref'> {
  adaptiveHeight?: boolean;
  /**
   * Previous / next arrows. Off by default; on by default with `variant="a2ui"`, where they hide
   * at either end.
   */
  arrows?: boolean;
  autoplay?: boolean | number;
  children?: ReactNode;
  defaultIndex?: number;
  dots?: boolean;
  index?: number;
  loop?: boolean;
  onIndexChange?: (index: number) => void;
  pauseOnHover?: boolean;
  ref?: Ref<CarouselRef>;
  /**
   * `variant="a2ui"`: gap between slides in pixels.
   * @default 8
   */
  slideGap?: number;
  /**
   * `variant="a2ui"`: how slides snap after a scroll (`scroll-snap-type`).
   * @default 'proximity'
   */
  snap?: 'none' | 'proximity' | 'mandatory';
  /**
   * `default`: one slide at a time with dots (and optional arrows, autoplay, loop).
   * `a2ui`: the A2UI standard carousel (CopilotKit Gen UI 2.0): a row of slides at their own
   * width that scrolls sideways and snaps, with round arrows at the edges and no dots; `index` /
   * `onIndexChange` follow the slide nearest the start. `autoplay`, `dots`, `loop`,
   * `adaptiveHeight` and `pauseOnHover` do not apply.
   * @default 'default'
   */
  variant?: 'default' | 'a2ui';
}
