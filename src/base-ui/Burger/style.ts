import { createStaticStyles } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  body: css`
    display: flex;
    flex-direction: column;
    padding-block: 8px;
    padding-inline: 12px;
  `,
  footer: css`
    display: flex;
    gap: 8px;
    margin-block-start: auto;
    padding: 20px;
  `,
  fullHeader: css`
    display: flex;
    flex: none;
    align-items: center;
    justify-content: flex-end;

    padding-inline: 12px;
  `,
  largeRow: css`
    min-height: 48px;
    padding-inline: 8px;
    border-radius: 12px;

    font-size: 32px;
    font-weight: 600;
    line-height: 1.15;
    color: ${cssVar.colorTextQuaternary};
    letter-spacing: -0.02em;

    background: none;

    &[aria-current='true'],
    &[aria-current='true']:hover {
      color: ${cssVar.colorText};
      background: none;
    }
  `,
  row: css`
    gap: 14px;

    min-height: 52px;
    padding-inline: 16px;
    border-radius: 999px;

    font-size: 17px;

    &[aria-current='true'],
    &[aria-current='true']:hover {
      font-weight: 600;
      color: ${cssVar.colorBgContainer};
      background: ${cssVar.colorText};
    }
  `,
}));
