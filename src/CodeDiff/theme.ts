import type { FileDiffOptions } from '@pierre/diffs';
import { registerCustomTheme, resolveTheme } from '@pierre/diffs';
import { cssVar } from 'antd-style';

import lobeTheme from '@/Highlighter/theme/lobe-theme';

import type { DiffViewMode } from './type';

let isLobeDiffThemeRegistered = false;

export const registerLobeDiffThemes = () => {
  if (isLobeDiffThemeRegistered) return;

  registerCustomTheme('lobe-theme', () => Promise.resolve(lobeTheme as any));
  void resolveTheme('lobe-theme');

  isLobeDiffThemeRegistered = true;
};

const customSeparatorCSS = `
  :host {
    --diffs-dark-bg: transparent !important;
    --diffs-light-bg: transparent !important;
    --diffs-gap-fallback: 8px;
    --diffs-added-light: ${cssVar.colorSuccessHover};
    --diffs-added-dark: ${cssVar.colorSuccessBorderHover};
    --diffs-modified-light: ${cssVar.colorInfoHover};
    --diffs-modified-dark: ${cssVar.colorInfoBorderHover};
    --diffs-deleted-light: ${cssVar.colorErrorHover};
    --diffs-deleted-dark: ${cssVar.colorErrorBorderHover};
  }

  [data-gutter-buffer] {
    opacity: 0.2 !important;
  }

  [data-code] {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }

  [data-gutter] {
    backdrop-filter: blur(16px) !important;
  }
`;

export const getLobeDiffOptions = ({
  diffOptions,
  isDarkMode,
  viewMode,
}: {
  diffOptions?: FileDiffOptions<string>;
  isDarkMode: boolean;
  viewMode: DiffViewMode;
}): FileDiffOptions<string> => ({
  theme: {
    dark: 'lobe-theme',
    light: 'lobe-theme',
  },
  themeType: isDarkMode ? 'dark' : 'light',
  diffStyle: viewMode,
  disableFileHeader: true,
  unsafeCSS: customSeparatorCSS,
  ...diffOptions,
});
