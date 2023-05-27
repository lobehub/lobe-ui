import { GetCustomStylish } from 'antd-style';
import { rgba } from 'polished';

declare module 'antd-style' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface CustomStylish extends SiteStylish {}
}

export interface SiteStylish {
  clickableText: string;
  resetLinkColor: string;

  heroButtonGradient: string;
  heroGradient: string;
  heroTextShadow: string;
  heroGradientFlow: string;
  heroBlurBall: string;

  iconGradientDefault: string;
  blur: string;
}

export const generateCustomStylish: GetCustomStylish<SiteStylish> = ({
  css,
  token,
  isDarkMode,
}) => {
  return {
    clickableText: css`
      cursor: pointer;
      color: ${token.colorTextSecondary};

      &:hover {
        color: ${token.colorText};
      }
    `,
    resetLinkColor: css`
      color: inherit;

      &:hover,
      &:active {
        color: inherit;
      }
    `,

    heroButtonGradient: css`
      background: linear-gradient(90deg, ${token.gradientColor1} 0%, ${token.gradientColor2} 100%);
    `,

    heroGradient: css`
      background-image: ${token.gradientHeroBgG};
      background-size: 300% 300%;
    `,

    heroGradientFlow: css`
      animation: flow 5s ease infinite;

      @keyframes flow {
        0% {
          background-position: 0 0;
        }

        50% {
          background-position: 100% 100%;
        }

        100% {
          background-position: 0 0;
        }
      }
    `,
    heroTextShadow: css`
      will-change: transform;
      text-shadow: 0 8px 20px ${rgba(token.gradientColor2, 0.2)},
        0 8px 60px ${rgba(token.gradientColor3, 0.2)},
        0 8px 80px ${rgba(token.cyan, isDarkMode ? 0.2 : 0.4)};
    `,
    heroBlurBall: css`
      will-change: transform;

      background: linear-gradient(
        135deg,
        ${token.gradientColor3} 0%,
        ${token.gradientColor1} 30%,
        ${token.red} 70%,
        ${token.cyan} 100%
      );
      background-size: 200% 200%;
      filter: blur(69px);

      animation: glow 10s ease infinite;

      @keyframes glow {
        0% {
          background-position: 0 -100%;
        }

        50% {
          background-position: 200% 50%;
        }

        100% {
          background-position: 0 -100%;
        }
      }
    `,

    iconGradientDefault: css`
      background-image: radial-gradient(
        100% 100% at 50% 0,
        ${rgba(token.colorSolid, 0.2)} 0,
        ${rgba(token.colorSolid, 0.1)} 100%
      );
    `,

    blur: css`
      backdrop-filter: blur(7px);
    `,
  };
};
