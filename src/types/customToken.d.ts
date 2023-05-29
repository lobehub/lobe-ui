const PresetColors = [
  'tomato',
  'red',
  'crimson',
  'pink',
  'plum',
  'purple',
  'violet',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'green',
  'grass',
  'orange',
  'brown',
  'sky',
  'mint',
  'lime',
  'yellow',
  'amber',
  'bronze',
  'gold',
  'gray',
  'mauve',
  'slate',
  'sage',
  'olive',
  'sand',
] as const;

export type PresetColorKey = (typeof PresetColors)[number];

export type PresetColorType = Record<PresetColorKey, string>;

type ColorPaletteKeyIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

type ColorTokenKey =
  | 'Bg'
  | 'BgHover'
  | 'Border'
  | 'BorderSecondary'
  | 'BorderHover'
  | 'Hover'
  | ''
  | 'Active'
  | 'TextHover'
  | 'Text'
  | 'TextActive';

export type ColorToken = {
  [key in `${keyof PresetColorType}${ColorTokenKey}`]: string;
};

export type ColorPalettes = {
  [key in `${keyof PresetColorType}${ColorPaletteKeyIndex}`]: string;
};

export type ColorPalettesAlpha = {
  [key in `${keyof PresetColorType}${ColorPaletteKeyIndex}A`]: string;
};

export interface LobeCustomToken {
  headerHeight: number;
  footerHeight: number;
  sidebarWidth: number;
  tocWidth: number;
  contentMaxWidth: number;
  colorSolid: string;
  gradientColor1: string;
  gradientColor2: string;
  gradientColor3: string;
  gradientHeroBgG: string;
}
