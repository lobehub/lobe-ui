import 'antd-style';

import { LobeCustomStylish } from '@lobehub/ui/types/customStylish';
import { LobeCustomToken } from '@lobehub/ui/types/customToken';
import { AntdToken } from 'antd-style/lib/types/theme';

declare module 'antd-style' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface CustomToken extends LobeCustomToken {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface CustomStylish extends LobeCustomStylish {}
}

declare module 'styled-components' {
  export interface DefaultTheme extends AntdToken, LobeCustomToken {}
}
