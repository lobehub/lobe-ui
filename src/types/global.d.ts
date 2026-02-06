import 'antd-style';

import type { LobeCustomStylish } from './customStylish';
import type { LobeCustomToken } from './customToken';

declare module 'antd-style' {
  export interface CustomToken extends LobeCustomToken {}

  export interface CustomStylish extends LobeCustomStylish {}
}
