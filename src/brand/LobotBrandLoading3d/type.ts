import type { SvgProps } from '@/types';

export interface LobotBrandLoading3dProps extends SvgProps {
  /**
   * Width and height of the box, as px or any CSS length. The mark rests in the lower part of
   * the box, which leaves room above it for the jump.
   * @default 64
   */
  size?: number | string;
}
