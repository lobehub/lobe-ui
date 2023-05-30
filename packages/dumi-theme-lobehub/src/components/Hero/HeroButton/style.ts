import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, stylish, cx }) => {
  return {
    button: cx(
      stylish.heroButtonGradient,
      stylish.heroGradientFlow,
      css`
        background-size: 200% 100%;
        border: none;

        &:hover {
          animation: none;
        }
      `,
    ),
  };
});
