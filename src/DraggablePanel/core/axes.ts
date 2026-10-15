export type Placement = 'bottom' | 'left' | 'right' | 'top';

export interface Axis {
  anchorEnd: boolean;
  ariaOrientation: 'horizontal' | 'vertical';
  cross: 'height' | 'width';
  cursor: 'col-resize' | 'row-resize';
  edge: Placement;
  extent: 'height' | 'width';
  grow: 1 | -1;
  point: 'x' | 'y';
  vertical: boolean;
}

export const AXES: Record<Placement, Axis> = {
  bottom: {
    anchorEnd: true,
    ariaOrientation: 'horizontal',
    cross: 'width',
    cursor: 'row-resize',
    edge: 'top',
    extent: 'height',
    grow: -1,
    point: 'y',
    vertical: true,
  },
  left: {
    anchorEnd: false,
    ariaOrientation: 'vertical',
    cross: 'height',
    cursor: 'col-resize',
    edge: 'right',
    extent: 'width',
    grow: 1,
    point: 'x',
    vertical: false,
  },
  right: {
    anchorEnd: true,
    ariaOrientation: 'vertical',
    cross: 'height',
    cursor: 'col-resize',
    edge: 'left',
    extent: 'width',
    grow: -1,
    point: 'x',
    vertical: false,
  },
  top: {
    anchorEnd: false,
    ariaOrientation: 'horizontal',
    cross: 'width',
    cursor: 'row-resize',
    edge: 'bottom',
    extent: 'height',
    grow: 1,
    point: 'y',
    vertical: true,
  },
};

export const mirrorPlacement = (placement: Placement): Placement => {
  if (placement === 'left') return 'right';
  if (placement === 'right') return 'left';
  return placement;
};
