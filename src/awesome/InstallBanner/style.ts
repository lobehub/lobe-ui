import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  footnote: css`
    margin: 0;
    font-size: ${cssVar.fontSizeSM};
    color: ${cssVar.colorTextTertiary};

    a {
      color: ${cssVar.colorPrimary};
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  `,
  content: css`
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
  `,
  root: css`
    overflow: hidden;
    padding-block: clamp(56px, 9vh, 88px);
    border-block-start: 1px solid ${cssVar.colorBorderSecondary};
    text-align: center;
  `,
  snippet: css`
    border-radius: 999px;
  `,
  title: css`
    margin: 0;

    font-size: clamp(22px, 3vw, 28px);
    font-weight: 650;
    color: ${cssVar.colorText};
    text-wrap: balance;
    letter-spacing: -0.02em;
  `,
}));
