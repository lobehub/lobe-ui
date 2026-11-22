import type { SvgProps } from '@/types';

export interface LobotBrandLoadingProps extends SvgProps {
  /**
   * Width and height of the mark, as px or any CSS length. It matches `LobotMono` at the same
   * size, so the loader can hand over to the static logo without a jump.
   * @default 64
   */
  size?: number | string;
}
