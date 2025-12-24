import type {
  ThemeProviderProps as AntdThemeProviderProps,
  CustomStylishParams,
  CustomTokenParams,
} from 'antd-style';
import type { CSSProperties } from 'react';

import type { Config } from '@/ConfigProvider';
import type { MotionComponentType } from '@/MotionProvider';
import type { NeutralColors, PrimaryColors } from '@/styles';

export interface ThemeProviderProps extends AntdThemeProviderProps<any> {
  className?: string;
  config?: Config;
  customFonts?: string[];
  customStylish?: (theme: CustomStylishParams) => { [key: string]: any };
  customTheme?: {
    neutralColor?: NeutralColors;
    primaryColor?: PrimaryColors;
  };
  customToken?: (theme: CustomTokenParams) => { [key: string]: any };
  enableCustomFonts?: boolean;
  enableGlobalStyle?: boolean;
  motion: MotionComponentType;
  style?: CSSProperties;
}

export interface MetaProps {
  description?: string;
  title?: string;
  withManifest?: boolean;
}
