import { ColorMapToken } from 'antd/es/theme/interface/maps/colors';

import { generateAssociatedColors } from './colorRelationship';
import {
  ColorPalettes,
  generateColorPalette,
  generateNeutralPalette,
  NeutralPaletteOptions,
  SeedColors,
  TokenType,
} from './paletteGenerator';

export type TokenRelationship = (type: TokenType) => Partial<Record<keyof ColorMapToken, number>>;

const defaultRelationship: TokenRelationship = (type) => {
  const key = type.toUpperCase()[0] + type.slice(1);

  return {
    [`color${key}Bg`]: 1,
    [`color${key}BgHover`]: 2,
    [`color${key}Border`]: 3,
    [`color${key}BorderHover`]: 4,
    [`color${key}Hover`]: 5,
    [`color${key}`]: 6,
    [`color${key}Active`]: 7,
    [`color${key}TextHover`]: 8,
    [`color${key}Text`]: 9,
    [`color${key}TextActive`]: 10,
  };
};

interface MapTokenAlgorithm extends NeutralPaletteOptions {
  relationship?: TokenRelationship;
  seedColors?: Partial<SeedColors>;
  infoColorFollowPrimary?: boolean;
  adjustWarning?: boolean;
  brandColor?: string;
}

export const genMapTokenAlgorithm = (mode: 'dark' | 'light', params?: MapTokenAlgorithm) => {
  const {
    relationship = defaultRelationship,
    infoColorFollowPrimary = false,
    adjustWarning,
    brandColor = mode === 'dark' ? '#fff' : '#000',
  } = params || {};

  const funcColors = generateAssociatedColors(brandColor, adjustWarning);

  const seedColors = {
    primary: brandColor,
    ...funcColors,
    ...params?.seedColors,
  };

  if (infoColorFollowPrimary) {
    seedColors.info = brandColor;
  }

  const palettes: ColorPalettes = {
    primary: generateColorPalette(seedColors.primary, params).map((color) => color.hex),
    error: generateColorPalette(seedColors.error, params).map((c) => c.hex),
    warning: generateColorPalette(seedColors.warning, params).map((c) => c.hex),
    success: generateColorPalette(seedColors.success, params).map((c) => c.hex),
    info: generateColorPalette(seedColors.info, params).map((color) => color.hex),
    neutral: generateNeutralPalette(seedColors.primary, { ...params, neutral: true }).map(
      (c) => c.hex,
    ),
    grey: generateNeutralPalette(seedColors.primary, params).map((c) => c.hex),
  };

  let tokens = {} as Partial<Record<keyof ColorMapToken, string>>;

  const types = ['primary', 'error', 'warning', 'success', 'info'] as TokenType[];

  types.forEach((type) => {
    Object.entries(relationship(type)).forEach(([key, value]) => {
      tokens[key as keyof ColorMapToken] = palettes[type][value];
    });
  });

  return { palettes, tokens };
};

export type { ColorPalettes } from './paletteGenerator';
