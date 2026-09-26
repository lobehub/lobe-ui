import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar, responsive }) => ({
  card: css`
    display: flex;
    grid-column: span var(--bento-col-span, 1);
    grid-row: span var(--bento-row-span, 1);
    flex-direction: column;

    min-inline-size: 0;
    padding-block: 14px 16px;
    padding-inline: 16px;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: ${cssVar.borderRadiusLG};

    background: color-mix(in srgb, ${cssVar.colorBgElevated} 25%, transparent);
    box-shadow: ${cssVar.boxShadowTertiary};

    transition:
      border-color 140ms ease,
      transform 140ms ease,
      box-shadow 140ms ease;

    &:hover {
      transform: translateY(-2px);
      border-color: ${cssVar.colorBorder};
      box-shadow: ${cssVar.boxShadowSecondary};
    }

    ${responsive.tablet} {
      &[data-wide='true'] {
        grid-column: span 2;
      }
    }

    ${responsive.mobile} {
      grid-column: span 1;
      grid-row: span 1;
    }

    @media (prefers-reduced-motion: reduce) {
      &:hover {
        transform: none;
      }
    }
  `,
  body: css`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;

    min-inline-size: 0;
    margin-block-start: 12px;

    > * {
      max-inline-size: 100%;
    }
  `,
  grid: css`
    display: grid;
    grid-auto-rows: minmax(var(--bento-row-height), auto);
    grid-template-columns: repeat(var(--bento-columns), minmax(0, 1fr));
    gap: 12px;

    ${responsive.tablet} {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    ${responsive.mobile} {
      grid-template-columns: 1fr;
    }
  `,
  header: css`
    display: flex;
    gap: 8px;
    align-items: baseline;
    justify-content: space-between;
  `,
  hint: css`
    overflow: hidden;

    font-size: 11px;
    color: ${cssVar.colorTextTertiary};
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  title: css`
    font-size: ${cssVar.fontSizeSM};
    font-weight: 600;
    color: ${cssVar.colorText};
    text-decoration: none;

    &[href]:hover {
      color: ${cssVar.colorPrimary};
    }
  `,
}));
