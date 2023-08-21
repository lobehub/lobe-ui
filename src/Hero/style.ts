import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ cx, css, responsive, token, stylish }) => ({
  actions: css`
    display: flex;
    gap: 24px;
    justify-content: center;
    margin-top: 24px;

    button {
      padding-inline: 32px !important;
      font-weight: 500;
    }

    ${responsive.mobile} {
      flex-direction: column;
      gap: 16px;
      width: 100%;
      margin-top: 24px;

      button {
        width: 100%;
      }
    }
  `,

  canvas: cx(
    stylish.gradientAnimation,
    css`
      pointer-events: none;

      position: absolute;
      z-index: 10;
      top: -250px;
      left: 50%;
      transform: translateX(-50%) scale(1.5);

      width: 600px;
      height: 400px;

      opacity: 0.2;
      filter: blur(100px);

      ${responsive.mobile} {
        width: 200px;
        height: 300px;
      }
    `,
  ),

  container: css`
    position: relative;
    box-sizing: border-box;
    text-align: center;
  `,

  desc: css`
    margin-top: 0;
    font-size: ${token.fontSizeHeading3}px;
    color: ${token.colorTextSecondary};
    text-align: center;

    ${responsive.mobile} {
      margin: 24px 16px;
      font-size: ${token.fontSizeHeading5}px;
    }
  `,
  title: css`
    z-index: 10;
    margin: 0;
    font-size: 100px;

    ${responsive({
      mobile: { display: 'flex', flexDirection: 'column', fontSize: 72, lineHeight: 1.2 },
    })}

    b {
      ${stylish.gradientAnimation}
      position: relative;
      z-index: 5;
      background-clip: text;

      -webkit-text-fill-color: transparent;

      &::selection {
        -webkit-text-fill-color: #000 !important;
      }
    }
  `,
}));
