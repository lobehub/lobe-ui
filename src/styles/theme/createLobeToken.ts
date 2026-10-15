import type { NeutralColors } from '../customTheme';
import { resolveStatusScales } from './customPalette';
import type { LobePrimaryColor } from './customPrimary';
import { createNeutralToken } from './token/neutral';
import { createPaletteToken } from './token/palette';
import { createPrimaryToken } from './token/primary';
import { staticToken } from './token/static';

export interface CreateLobeTokenParams {
  appearance: 'light' | 'dark';
  neutralColor?: NeutralColors;
  palette?: string;
  primaryColor?: LobePrimaryColor;
}

export const createLobeTokenGroups = ({
  appearance,
  neutralColor,
  palette: paletteName,
  primaryColor,
}: CreateLobeTokenParams) => {
  const palette = createPaletteToken(appearance, resolveStatusScales(paletteName));

  return {
    neutral: createNeutralToken(appearance, neutralColor, palette),
    palette,
    primary: createPrimaryToken(appearance, primaryColor),
    static: staticToken,
  };
};

export type LobeTokenGroups = ReturnType<typeof createLobeTokenGroups>;

export type LobeToken = LobeTokenGroups['static'] &
  LobeTokenGroups['palette'] &
  LobeTokenGroups['primary'] &
  LobeTokenGroups['neutral'];

export const createLobeToken = (params: CreateLobeTokenParams): LobeToken => {
  const groups = createLobeTokenGroups(params);

  return { ...groups.static, ...groups.palette, ...groups.primary, ...groups.neutral };
};
