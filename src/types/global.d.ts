import 'antd-style';

import { LobeCustomStylish } from './customStylish';
import { LobeCustomToken } from './customToken';

declare module 'antd-style' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface CustomToken extends LobeCustomToken {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface CustomStylish extends LobeCustomStylish {}
}

// Support for Vite's ?raw import
declare module '*.css?raw' {
  const content: string;
  export default content;
}
