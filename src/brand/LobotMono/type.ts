import type { SvgProps } from '@/types';

export interface LobotMonoProps extends SvgProps {
  /**
   * Width and height of the mark, as px or any CSS length.
   * @default '1em'
   */
  size?: number | string;
}
