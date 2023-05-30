import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, responsive, token, stylish, isDarkMode }) => ({
  container: css`
    position: relative;
    box-sizing: border-box;
    text-align: center;

    + * {
      position: relative;
    }

    > p {
      margin: 32px;
      font-size: 20px;
      line-height: 1.6;
      color: ${token.colorTextSecondary};

      ${responsive({
        mobile: { fontSize: 16 },
      })}
    }
  `,

  titleContainer: css`
    position: relative;
  `,
  title: css`
    z-index: 10;
    margin: 0;
    font-size: 68px;
    color: transparent;

    ${responsive({
      mobile: { fontSize: 40 },
    })}

    b {
      position: relative;
      z-index: 5;
      ${stylish.heroGradient};
      ${stylish.heroGradientFlow}
      background-clip: text;

      -webkit-text-fill-color: transparent;
    }
  `,
  titleShadow: css`
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;

    font-size: 68px;
    font-weight: bold;
    color: ${isDarkMode ? token.colorWhite : token.colorTextBase};

    ${responsive({
      mobile: { fontSize: 40 },
    })}

    b {
      color: transparent;
    }
  `,

  desc: css`
    font-size: ${token.fontSizeHeading3}px;
    color: ${token.colorTextSecondary};

    ${responsive.mobile} {
      margin: 24px 16px;
      font-size: ${token.fontSizeHeading5}px;
    }
  `,

  actions: css`
    display: flex;
    justify-content: center;
    margin-top: 48px;

    ${responsive({
      mobile: { marginTop: 24 },
    })}
  `,
  canvas: css`
    ${stylish.heroBlurBall}
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
