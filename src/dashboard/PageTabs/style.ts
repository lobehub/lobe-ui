import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar, responsive }) => ({
  count: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;

    min-inline-size: 1.5em;
    padding-inline: ${cssVar.paddingXXS};
    border-radius: ${cssVar.borderRadiusXS};

    font-size: ${cssVar.fontSizeSM};
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    line-height: 1.4;
    color: ${cssVar.colorTextSecondary};

    background: ${cssVar.colorFillSecondary};
  `,
  list: css`
    scrollbar-width: none;
    overflow-x: auto;
    flex-wrap: nowrap;
    max-inline-size: 100%;

    &::-webkit-scrollbar {
      display: none;
    }

    && {
      gap: ${cssVar.paddingXXS};
      padding: ${cssVar.paddingXXS};
    }
  `,
  panel: css`
    padding-block-start: 16px;
  `,
  root: css`
    min-inline-size: 0;
  `,
  tab: css`
    flex: none;

    && {
      gap: ${cssVar.paddingXS};
    }

    ${responsive.mobile} {
      min-block-size: 44px;
    }
  `,
}));
