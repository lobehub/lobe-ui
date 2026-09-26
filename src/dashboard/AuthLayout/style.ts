import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar, responsive }) => ({
  aside: css`
    position: relative;

    flex: none;

    box-sizing: border-box;
    inline-size: 50%;
    min-inline-size: 0;
    max-inline-size: 50%;

    background: ${cssVar.colorFillSecondary};

    ${responsive.laptop} {
      display: none;
    }
  `,
  description: css`
    line-height: 1.6;
    color: ${cssVar.colorTextSecondary};
  `,
  form: css`
    display: flex;
    flex: none;
    flex-direction: column;
    gap: 24px;
    justify-content: center;

    box-sizing: border-box;
    inline-size: 100%;
    min-inline-size: 0;
    padding-block: 40px;
    padding-inline: 36px;

    ${responsive.laptop} {
      padding-block: 28px;
      padding-inline: 24px;
    }
  `,
  formSplit: css`
    inline-size: 50%;
    max-inline-size: 50%;

    ${responsive.laptop} {
      inline-size: 100%;
      max-inline-size: 100%;
    }
  `,
  frame: css`
    overflow: hidden;
    display: flex;
    flex: none;

    inline-size: 100%;
    min-inline-size: 0;
    border-radius: inherit;
  `,
  header: css`
    display: flex;
    flex: none;
    gap: 12px;
    align-items: center;
    justify-content: space-between;

    block-size: 56px;
    padding-inline: 16px;
  `,
  lift: css`
    display: flex;
    inline-size: min(440px, 100%);
  `,
  liftSplit: css`
    inline-size: min(880px, 100%);

    ${responsive.laptop} {
      inline-size: min(440px, 100%);
    }
  `,
  main: css`
    display: grid;
    flex: 1;
    place-items: center;

    padding-block: 24px 48px;
    padding-inline: 16px;
  `,
  page: css`
    display: flex;
    flex-direction: column;

    block-size: 100%;
    min-block-size: 0;

    background: ${cssVar.colorBgLayout};
  `,
  split: css`
    min-block-size: 520px;

    ${responsive.laptop} {
      min-block-size: 0;
    }
  `,
  title: css`
    margin: 0;
    font-size: ${cssVar.fontSizeHeading3};
    line-height: ${cssVar.lineHeightHeading3};
  `,
  tools: css`
    display: flex;
    gap: 6px;
    align-items: center;
    margin-inline-start: auto;
  `,
}));
