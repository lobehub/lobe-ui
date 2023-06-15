import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, responsive, token, stylish }) => ({
  container: css`
    position: relative;
    box-sizing: border-box;
    text-align: center;
  `,

  title: css`
    z-index: 10;
    margin: 0;
    font-size: 100px;

    ${responsive({
      mobile: { fontSize: 72, flexDirection: 'column', display: 'flex', lineHeight: 1.2 },
    })}

    b {
      ${stylish.gradientAnimation}
      position: relative;
      z-index: 5;
      background-clip: text;

      -webkit-text-fill-color: transparent;
    }
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

  actions: css`
    display: flex;
    justify-content: center;
    margin-top: 24px;

    button {
      padding-inline: 32px !important;
      font-weight: 500;
    }

    ${responsive({
      mobile: { marginTop: 24 },
    })}
  `,
  canvas: css`
    ${stylish.gradientAnimation};
    filter: blur(100px);

    pointer-events: none;

    position: absolute;
    z-index: 10;
    top: -250px;
    left: 50%;
    transform: translateX(-50%) scale(1.5);

    width: 600px;
    height: 400px;

    opacity: 0.2;

    ${responsive.mobile} {
      width: 200px;
      height: 300px;
    }
  `,
}));
