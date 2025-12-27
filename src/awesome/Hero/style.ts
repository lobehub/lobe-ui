import { createStaticStyles, responsive } from 'antd-style';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  actions: css`
    margin-block-start: 24px;

    button {
      padding-inline: 32px !important;
      font-weight: 500;
    }

    ${responsive.sm} {
      flex-direction: column;
      gap: 16px;
      width: 100%;
      margin-block-start: 24px;

      button {
        width: 100%;
      }
    }
  `,

  container: css`
    position: relative;
    box-sizing: border-box;
    text-align: center;
  `,

  desc: css`
    margin-block-start: 0;
    font-size: ${cssVar.fontSizeHeading3};
    color: ${cssVar.colorTextSecondary};
    text-align: center;

    ${responsive.sm} {
      margin-block: 24px;
      margin-inline: 16px;
      font-size: ${cssVar.fontSizeHeading5};
    }
  `,
  title: css`
    z-index: 10;

    margin: 0;

    font-size: min(100px, 10vw);
    line-height: 1.2;
    text-align: center;

    b {
      ${lobeStaticStylish.gradientAnimation}
      position: relative;
      z-index: 5;
      background-clip: text;

      -webkit-text-fill-color: transparent;

      &::selection {
        -webkit-text-fill-color: #000 !important;
      }
    }

    ${responsive.sm} {
      font-size: 64px;
    }
  `,
}));
