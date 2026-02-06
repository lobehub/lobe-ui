import { createStaticStyles, cx, keyframes } from 'antd-style';
import { cva } from 'class-variance-authority';

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    animated: css`
      img {
        opacity: 1;
        animation: ${fadeIn} 0.5s ease-in-out;
      }
    `,

    mermaid: cx(
      'ant-mermaid-mermaid',
      css`
        img {
          display: block;
          width: 100%;
          height: auto;
        }
      `,
    ),

    noBackground: css`
      img {
        background: transparent !important;
      }
    `,

    noPadding: css`
      padding: 0;
    `,

    padding: css`
      padding: 16px;
    `,

    root: css`
      direction: ltr;
      margin: 0;
      padding: 0;
      text-align: start;
    `,

    unmermaid: css`
      color: ${cssVar.colorTextDescription};
    `,
  };
});

export const variants = cva(styles.root, {
  defaultVariants: {
    animated: false,
    mermaid: true,
    showBackground: false,
    variant: 'borderless',
  },

  variants: {
    mermaid: {
      false: styles.unmermaid,
      true: styles.mermaid,
    },
    showBackground: {
      false: styles.noBackground,
      true: null,
    },
    animated: {
      true: styles.animated,
      false: null,
    },
    variant: {
      filled: styles.padding,
      outlined: styles.padding,
      borderless: styles.noPadding,
    },
  },
});
