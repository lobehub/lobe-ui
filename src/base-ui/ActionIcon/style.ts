import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(() => {
  return {
    active: lobeStaticStylish.active,
    glass: lobeStaticStylish.blur,
    shadow: lobeStaticStylish.shadow,
  };
});

export const variants = cva(null, {
  defaultVariants: {
    active: false,
    glass: false,
    shadow: false,
  },

  variants: {
    active: {
      false: null,
      true: styles.active,
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
