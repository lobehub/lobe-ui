import { Theme as AntdStyleTheme } from 'antd-style';

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends AntdStyleTheme {}
}
