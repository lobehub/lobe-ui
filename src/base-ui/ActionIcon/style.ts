import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    active: lobeStaticStylish.active,
    // &&& outranks both base-ui Button's variant classes and this file's own `root` color
    // (same `&&` weight, inserted later), so the icon itself turns red, not just the fill.
    dangerRoot: css`
      /* Mirrors the neutral ladder (colorTextTertiary -> colorTextSecondary -> colorText):
         a softened red at rest, full colorError on hover, colorErrorActive when pressed. */
      &&& {
        color: color-mix(in srgb, ${cssVar.colorError} 66%, transparent);
      }

      &&&:hover:not(:disabled, [aria-disabled='true']) {
        color: ${cssVar.colorError};
      }

      &&&:active:not(:disabled, [aria-disabled='true']) {
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
