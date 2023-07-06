import { Theme, css } from 'antd-style';
import { readableColor, rgba } from 'polished';

import { colorScales } from '@/styles/colors';

export const genStyles = (token: Theme, isDarkMode: boolean) => {
  const type = isDarkMode ? 'dark' : 'light';
  const colorText = colorScales.gray[type][11];
  const colorTextSecondary = colorScales.gray[type][10];
  const colorTextTertiary = colorScales.gray[type][7];
  const colorRed = isDarkMode ? colorScales.red[type][9] : colorScales.volcano[type][9];
  const colorOrange = isDarkMode ? colorScales.gold[type][9] : colorScales.orange[type][9];
  const colorGreen = isDarkMode ? colorScales.lime[type][9] : colorScales.green[type][9];
  const colorBlue = isDarkMode ? colorScales.blue[type][9] : colorScales.geekblue[type][9];
  const loaderContainer = isDarkMode
    ? 'https://github.com/images/modules/pulls/progressive-disclosure-line-dark.svg'
    : 'https://github.com/images/modules/pulls/progressive-disclosure-line.svg';
  const loadingImage = isDarkMode
    ? 'https://github.githubassets.com/images/mona-loading-dark.gif'
    : 'https://github.githubassets.com/images/mona-loading-default.gif';
  return css`
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
      --color-btn-text: ${token.colorText};
      --color-btn-bg: ${token.colorFillTertiary};
      --color-btn-border: ${token.colorBorderSecondary};
      --color-btn-shadow: 0 0 transparent;
      --color-btn-inset-shadow: 0 0 transparent;
      --color-btn-hover-bg: ${token.colorFillSecondary};
      --color-btn-hover-border: ${token.colorBorder};
      --color-btn-active-bg: ${token.colorFillSecondary};
      --color-btn-active-border: ${token.colorBorder};
      --color-btn-selected-bg: ${token.colorFillSecondary};
      --color-btn-primary-text: ${readableColor(token.colorPrimary)};
      --color-btn-primary-bg: ${token.colorPrimary};
      --color-btn-primary-border: ${token.colorPrimaryBorder};
      --color-btn-primary-shadow: 0 0 transparent;
      --color-btn-primary-inset-shadow: 0 0 transparent;
      --color-btn-primary-hover-bg: ${token.colorPrimaryHover};
      --color-btn-primary-hover-border: ${token.colorPrimaryBorderHover};
      --color-btn-primary-selected-bg: ${token.colorPrimaryActive};
      --color-btn-primary-selected-shadow: 0 0 transparent;
      --color-btn-primary-disabled-text: ${rgba(readableColor(token.colorPrimary), 0.5)};
      --color-btn-primary-disabled-bg: ${rgba(token.colorPrimary, 0.5)};
      --color-btn-primary-disabled-border: ${rgba(token.colorPrimaryBorder, 0.5)};
      --color-action-list-item-default-hover-bg: ${token.colorFillQuaternary};
      --color-segmented-control-bg: ${token.colorFillTertiary};
      --color-segmented-control-button-bg: transparent;
      --color-segmented-control-button-selected-border: ${token.colorBorder};
      --color-fg-default: ${token.colorText};
      --color-fg-muted: ${token.colorTextSecondary};
      --color-fg-subtle: ${token.colorTextQuaternary};
      --color-canvas-default: transparent;
      --color-canvas-overlay: ${token.colorBgElevated};
      --color-canvas-inset: transparent;
      --color-canvas-subtle: ${token.colorFillQuaternary};
      --color-border-default: ${token.colorBorder};
      --color-border-muted: ${token.colorBorderSecondary};
      --color-neutral-muted: ${token.colorFillQuaternary};
      --color-neutral-subtle: ${token.colorFillTertiary};
      --color-accent-fg: ${token.colorInfo};
      --color-accent-emphasis: ${token.colorInfoBorderHover};
      --color-accent-muted: ${token.colorInfoBorder};
      --color-accent-subtle: ${token.colorInfoBg};
      --color-success-fg: ${token.colorSuccess};
      --color-attention-fg: ${token.colorWarning};
      --color-attention-muted: ${token.colorWarningBorder};
      --color-attention-subtle: ${token.colorWarningBg};
      --color-danger-fg: ${token.colorError};
      --color-danger-muted: ${token.colorErrorBorder};
      --color-danger-subtle: ${token.colorErrorBg};
      --color-primer-shadow-inset: 0 0 transparent;
      --color-scale-gray-7: ${token.colorBgContainer};
      --color-scale-blue-8: ${token.colorInfoBg};
      --color-social-reaction-bg-hover: ${token.colorFillSecondary};
      --color-social-reaction-bg-reacted-hover: ${token.colorInfoBgHover};

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
        border-color: ${token.colorInfoBorderHover};
        border-radius: ${token.borderRadius}px;
      }

      .gsc-loading-image {
        background-image: url(${loadingImage});
      }
    }
  `;
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
