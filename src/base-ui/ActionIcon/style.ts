import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    active: lobeStaticStylish.active,
    // && outranks base-ui Button's variant classes regardless of style insertion order
    dangerRoot: css`
      &&:hover {
        color: ${cssVar.colorError};
      }

      &&:active {
        color: ${cssVar.colorErrorActive};
      }
    `,
    glass: lobeStaticStylish.blur,
    root: css`
      && {
        color: ${cssVar.colorTextTertiary};
      }

      &&:hover {
        color: ${cssVar.colorTextSecondary};
      }

      &&:active {
        color: ${cssVar.colorText};
      }
    `,
    shadow: lobeStaticStylish.shadow,
  };
});

export const variants = cva(styles.root, {
  defaultVariants: {
    active: false,
    danger: false,
    glass: false,
    shadow: false,
  },

  variants: {
    active: {
      false: null,
      true: styles.active,
    },
    danger: {
      false: null,
      true: styles.dangerRoot,
    },
    glass: {
      false: null,
      true: styles.glass,
    },
    shadow: {
      false: null,
      true: styles.shadow,
    },
  },
});
