import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar, responsive }) => ({
  body: css`
    margin-block-start: 32px;
  `,
  description: css`
    max-inline-size: 34rem;
    margin: 0;

    font-size: 15px;
    line-height: 1.6;
    color: ${cssVar.colorTextSecondary};
    text-wrap: pretty;
  `,
  eyebrow: css`
    margin-block-end: 6px;
  `,
  extra: css`
    display: flex;
    flex: none;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;

    ${responsive.mobile} {
      [data-align='start'] > & {
        align-self: flex-start;
      }
    }
  `,
  header: css`
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;

    text-align: center;

    &[data-align='start'] {
      flex-direction: row;
      gap: 32px;
      align-items: flex-end;
      justify-content: space-between;

      text-align: start;

      ${responsive.mobile} {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }
    }
  `,
  heading: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;

    min-inline-size: 0;

    [data-align='start'] > & {
      align-items: flex-start;
    }
  `,
  root: css`
    padding-block: clamp(48px, 8vh, 80px);

    &[data-divider='true'] {
      border-block-start: 1px solid ${cssVar.colorBorderSecondary};
    }
  `,
  title: css`
    margin: 0;

    font-size: clamp(24px, 3vw, 32px);
    font-weight: bold;
    line-height: 1.2;
    color: ${cssVar.colorText};
    text-wrap: balance;
    letter-spacing: -0.025em;
  `,
}));
