import type { NeutralColors, PrimaryColors } from '../customTheme';
import { createNeutralToken } from './token/neutral';
import { createPaletteToken } from './token/palette';
import { createPrimaryToken } from './token/primary';
import { staticToken } from './token/static';

export interface CreateLobeTokenParams {
  appearance: 'light' | 'dark';
  neutralColor?: NeutralColors;
  primaryColor?: PrimaryColors;
}

export const createLobeTokenGroups = ({
  appearance,
  neutralColor,
  primaryColor,
}: CreateLobeTokenParams) => {
  const palette = createPaletteToken(appearance);

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
