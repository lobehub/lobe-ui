import { Theme as AntdStyleTheme } from 'antd-style';
import React from 'react';

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends AntdStyleTheme {}
}

export type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

declare global {
  type SvgProps = React.DetailedHTMLProps<React.HTMLAttributes<SVGSVGElement>, SVGSVGElement>;

  type ImgProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLImageElement>, HTMLImageElement>;
}
