import { type Side } from '@/utils/placement';

type InsetSideOffsetData = {
  anchor: {
    height: number;
    width: number;
  };
  side: Side;
};

export const getInsetSideOffset = ({ anchor, side }: InsetSideOffsetData) => {
  if (side === 'left' || side === 'right' || side === 'inline-start' || side === 'inline-end') {
    return -anchor.width;
  }

  return -anchor.height;
};
