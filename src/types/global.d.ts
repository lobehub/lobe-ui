import { ColorPalettes, ColorPalettesAlpha, ColorToken } from '@/types/customToken';
import 'antd-style';
import { AntdToken } from 'antd-style/lib/types/theme';
import { LobeCustomStylish } from './customStylish';
import { LobeCustomToken } from './customToken';

declare module 'antd-style' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface CustomToken
    extends LobeCustomToken,
      ColorToken,
      ColorPalettes,
      ColorPalettesAlpha {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface CustomStylish extends LobeCustomStylish {}
}

declare module 'styled-components' {
  export interface DefaultTheme extends AntdToken, LobeCustomToken {}
}
