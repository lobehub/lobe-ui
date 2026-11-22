import type { SvgProps } from '@/types';

export interface LobotTextProps extends SvgProps {
  /**
   * Height of the wordmark, as px or any CSS length. The width follows the 82:24 ratio.
   * @default '1em'
   */
  size?: number | string;
}
