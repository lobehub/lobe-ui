import { createStaticStyles, keyframes } from 'antd-style';
import { cva } from 'class-variance-authority';

const spin = keyframes`
  0% {
    rotate: 0deg;
  }
  100% {
    rotate: 360deg;
  }
`;

export const styles = createStaticStyles(({ css }) => {
  return {
    spin: css`
      animation: ${spin} 1s linear infinite;
    `,
  };
});

export const variants = cva('anticon', {
  defaultVariants: {
    spin: false,
  },

  variants: {
    spin: {
      false: null,
      true: styles.spin,
    },
  },
});
