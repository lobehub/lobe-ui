import type { ComponentProps, ReactNode, Ref } from 'react';

export interface CarouselRef {
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
}

export interface CarouselProps extends Omit<ComponentProps<'div'>, 'children' | 'ref'> {
  adaptiveHeight?: boolean;
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
}
