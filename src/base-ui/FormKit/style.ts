import { createStaticStyles } from '@/styles';

export const fieldKitStyles = createStaticStyles(({ css, cssVar }) => ({
  controlFixed: css`
    flex: none;
    align-items: stretch;
  `,
  extra: css`
    font-size: 12px;
    color: ${cssVar.colorTextDescription};
  `,
  required: css`
    margin-inline-start: 4px;
    color: ${cssVar.colorError};
  `,
}));

export const listStyles = createStaticStyles(({ css, cssVar }) => ({
  add: css`
    cursor: pointer;

    display: inline-flex;
    gap: 6px;
    align-items: center;

    height: 28px;
    padding-inline: 8px;
    border: none;
    border-radius: ${cssVar.borderRadiusSM};

    font: inherit;
    font-size: 13px;
    font-weight: 500;
    color: ${cssVar.colorTextSecondary};

    background: none;

    transition:
      color 150ms ${cssVar.motionEaseOut},
      background 150ms ${cssVar.motionEaseOut};

    &:hover {
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillTertiary};
    }
  `,
  cell: css`
    min-width: 0;

    /* borderless until focused or invalid, so the table reads as one surface */
    & > *:not(:focus-within, :has([aria-invalid='true'])) {
      border-color: transparent;
      background: transparent;
      box-shadow: none;
    }

    & > *:hover:not(:focus-within, :has([aria-invalid='true'])) {
      background: ${cssVar.colorFillTertiary};
    }
  `,
  empty: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;

    padding-block: 20px 16px;
    padding-inline: 12px;

    font-size: 13px;
    color: ${cssVar.colorTextSecondary};
  `,
  foot: css`
    padding: 4px;
  `,
  head: css`
    display: grid;
    gap: 4px;

    padding-inline: 4px;
    border-block-end: 1px solid ${cssVar.colorBorderSecondary};

    background: ${cssVar.colorFillQuaternary};
  `,
  row: css`
    display: grid;
    gap: 4px;
    align-items: center;

    padding: 4px;
    border-block-end: 1px solid ${cssVar.colorSplit};

    & > :last-child {
      justify-self: center;
    }
  `,
  table: css`
    overflow: hidden;

    width: 100%;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: ${cssVar.borderRadiusLG};

    background: ${cssVar.colorBgContainer};
  `,
  title: css`
    padding-block: 8px;
    padding-inline: 12px;

    font-size: 11px;
    font-weight: 600;
    color: ${cssVar.colorTextSecondary};
    text-transform: uppercase;
    letter-spacing: 0.08em;
  `,
}));
