import { css, useTheme } from 'antd-style';
import { rgba } from 'polished';
import { useMemo } from 'react';

import { safeReadableColor } from '@/utils/safeReadableColor';

export const useStyles = () => {
  const theme = useTheme();
  const colorText = theme.colorText;
  const colorTextSecondary = theme.colorTextSecondary;
  const colorTextTertiary = theme.colorTextTertiary;
  const colorRed = theme.colorError;
  const colorOrange = theme.colorWarning;
  const colorGreen = theme.colorSuccess;
  const colorBlue = theme.colorInfo;
  const loaderContainer = theme.isDarkMode
    ? 'https://github.com/images/modules/pulls/progressive-disclosure-line-dark.svg'
    : 'https://github.com/images/modules/pulls/progressive-disclosure-line.svg';
  const loadingImage = theme.isDarkMode
    ? 'https://github.githubassets.com/images/mona-loading-dark.gif'
    : 'https://github.githubassets.com/images/mona-loading-default.gif';
  const { styles } = css`
    main {
      --color-prettylights-syntax-comment: ${colorTextTertiary};
      --color-prettylights-syntax-constant: ${colorGreen};
      --color-prettylights-syntax-entity: ${colorOrange};
      --color-prettylights-syntax-storage-modifier-import: ${colorRed};
      --color-prettylights-syntax-entity-tag: ${colorBlue};
      --color-prettylights-syntax-keyword: ${colorBlue};
      --color-prettylights-syntax-string: ${colorGreen};
      --color-prettylights-syntax-variable: ${colorRed};
      --color-prettylights-syntax-brackethighlighter-unmatched: ${colorRed};
      --color-prettylights-syntax-invalid-illegal-text: ${colorTextSecondary};
      --color-prettylights-syntax-invalid-illegal-bg: ${rgba(colorRed, 0.4)};
      --color-prettylights-syntax-carriage-return-text: ${colorTextSecondary};
      --color-prettylights-syntax-carriage-return-bg: ${rgba(colorRed, 0.6)};
      --color-prettylights-syntax-string-regexp: ${colorGreen};
      --color-prettylights-syntax-markup-list: ${colorOrange};
      --color-prettylights-syntax-markup-heading: ${colorBlue};
      --color-prettylights-syntax-markup-italic: ${colorTextSecondary};
      --color-prettylights-syntax-markup-bold: ${colorTextSecondary};
      --color-prettylights-syntax-markup-deleted-text: ${colorTextSecondary};
      --color-prettylights-syntax-markup-deleted-bg: ${rgba(colorRed, 0.2)};
      --color-prettylights-syntax-markup-inserted-text: ${colorGreen};
      --color-prettylights-syntax-markup-inserted-bg: ${rgba(colorGreen, 0.2)};
      --color-prettylights-syntax-markup-changed-text: ${colorOrange};
      --color-prettylights-syntax-markup-changed-bg: ${rgba(colorRed, 0.2)};
      --color-prettylights-syntax-markup-ignored-text: ${colorTextSecondary};
      --color-prettylights-syntax-markup-ignored-bg: ${rgba(colorBlue, 0.2)};
      --color-prettylights-syntax-meta-diff-range: ${colorOrange};
      --color-prettylights-syntax-brackethighlighter-angle: ${colorTextSecondary};
      --color-prettylights-syntax-sublimelinter-gutter-mark: ${colorTextTertiary};
      --color-prettylights-syntax-constant-other-reference-link: ${colorBlue};
      --color-btn-text: ${theme.colorText};
      --color-btn-bg: ${theme.colorFillTertiary};
      --color-btn-border: ${theme.colorBorderSecondary};
      --color-btn-shadow: 0 0 transparent;
      --color-btn-inset-shadow: 0 0 transparent;
      --color-btn-hover-bg: ${theme.colorFillSecondary};
      --color-btn-hover-border: ${theme.colorBorder};
      --color-btn-active-bg: ${theme.colorFillSecondary};
      --color-btn-active-border: ${theme.colorBorder};
      --color-btn-selected-bg: ${theme.colorFillSecondary};
      --color-btn-primary-text: ${safeReadableColor(theme.colorPrimary)};
      --color-btn-primary-bg: ${theme.colorPrimary};
      --color-btn-primary-border: ${theme.colorPrimaryBorder};
      --color-btn-primary-shadow: 0 0 transparent;
      --color-btn-primary-inset-shadow: 0 0 transparent;
      --color-btn-primary-hover-bg: ${theme.colorPrimaryHover};
      --color-btn-primary-hover-border: ${theme.colorPrimaryBorderHover};
      --color-btn-primary-selected-bg: ${theme.colorPrimaryActive};
      --color-btn-primary-selected-shadow: 0 0 transparent;
      --color-btn-primary-disabled-text: ${rgba(safeReadableColor(theme.colorPrimary), 0.5)};
      --color-btn-primary-disabled-bg: ${rgba(theme.colorPrimary, 0.5)};
      --color-btn-primary-disabled-border: ${rgba(theme.colorPrimaryBorder, 0.5)};
      --color-action-list-item-default-hover-bg: ${theme.colorFillQuaternary};
      --color-segmented-control-bg: ${theme.colorFillTertiary};
      --color-segmented-control-button-bg: transparent;
      --color-segmented-control-button-selected-border: ${theme.colorBorder};
      --color-fg-default: ${theme.colorText};
      --color-fg-muted: ${theme.colorTextSecondary};
      --color-fg-subtle: ${theme.colorTextQuaternary};
      --color-canvas-default: transparent;
      --color-canvas-overlay: ${theme.colorBgElevated};
      --color-canvas-inset: transparent;
      --color-canvas-subtle: ${theme.colorFillQuaternary};
      --color-border-default: ${theme.colorBorder};
      --color-border-muted: ${theme.colorBorderSecondary};
      --color-neutral-muted: ${theme.colorFillQuaternary};
      --color-neutral-subtle: ${theme.colorFillTertiary};
      --color-accent-fg: ${theme.colorInfo};
      --color-accent-emphasis: ${theme.colorInfoBorderHover};
      --color-accent-muted: ${theme.colorInfoBorder};
      --color-accent-subtle: ${theme.colorInfoBg};
      --color-success-fg: ${theme.colorSuccess};
      --color-attention-fg: ${theme.colorWarning};
      --color-attention-muted: ${theme.colorWarningBorder};
      --color-attention-subtle: ${theme.colorWarningBg};
      --color-danger-fg: ${theme.colorError};
      --color-danger-muted: ${theme.colorErrorBorder};
      --color-danger-subtle: ${theme.colorErrorBg};
      --color-primer-shadow-inset: 0 0 transparent;
      --color-scale-gray-7: ${theme.colorBgContainer};
      --color-scale-blue-8: ${theme.colorInfoBg};
      --color-social-reaction-bg-hover: ${theme.colorFillSecondary};
      --color-social-reaction-bg-reacted-hover: ${theme.colorInfoBgHover};

      .markdown pre {
        color: ${colorText};
      }

      .pagination-loader-container {
        background-image: url(${loaderContainer});
      }

      .gsc-pagination-button {
        background-color: var(--color-btn-bg);
      }

      .gsc-reactions-popover {
        width: 170px;

        > .m-2 {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
      }

      .gsc-emoji-button.has-reacted {
        border-color: ${theme.colorInfoBorderHover};
        border-radius: ${theme.borderRadius}px;
      }

      .gsc-loading-image {
        background-image: url(${loadingImage});
      }
    }
  `;

  return useMemo(() => `data:text/css;base64,${btoa(styles)}`, [styles]);
};

export const formatLang = (lang: string) => {
  if (['zh_CN', 'zh_TW'].includes(lang)) {
    return lang.replace('_', '-');
  } else if (lang === 'zh_HK') {
    return 'zh-TW';
  } else {
    return lang.split('_')[0];
  }
};
