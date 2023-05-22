import { Theme as AntdStyleTheme } from 'antd-style';
import React from 'react';

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends AntdStyleTheme {}
}

declare global {
  type DivProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

  type SvgProps = React.DetailedHTMLProps<React.HTMLAttributes<SVGSVGElement>, SVGSVGElement>;

  type ImgProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLImageElement>, HTMLImageElement>;
}
