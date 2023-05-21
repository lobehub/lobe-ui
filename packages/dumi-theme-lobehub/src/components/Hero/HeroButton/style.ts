import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, stylish }) => {
  return {
    button: css`
      border: none;

      ${stylish.heroButtonGradient}
      ${stylish.heroGradientFlow}

      background-size: 200% 100%;

      &:hover {
        animation: none;
      }
    `,
  };
});
