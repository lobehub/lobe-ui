import type {
  ThemeProviderProps as AntdThemeProviderProps,
  CustomStylishParams,
  CustomTokenParams,
} from 'antd-style';
import type { CSSProperties } from 'react';

import type { NeutralColors, PrimaryColors } from '@/styles';

export interface ThemeProviderProps extends AntdThemeProviderProps<any> {
  className?: string;
  customFonts?: string[];
  customStylish?: (theme: CustomStylishParams) => { [key: string]: any };
  customTheme?: {
    neutralColor?: NeutralColors;
    primaryColor?: PrimaryColors;
  };
  customToken?: (theme: CustomTokenParams) => { [key: string]: any };
  enableCustomFonts?: boolean;
  enableGlobalStyle?: boolean;
  style?: CSSProperties;
}

export interface MetaProps {
  description?: string;
  title?: string;
  withManifest?: boolean;
}
