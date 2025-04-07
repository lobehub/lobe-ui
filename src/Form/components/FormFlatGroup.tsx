'use client';

import { createStyles, useResponsive } from 'antd-style';
import { cva } from 'class-variance-authority';
import { forwardRef, useMemo } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

import { FormVariant } from '../type';

const useStyles = createStyles(({ cx, css, token, stylish }) => {
  return {
    borderless: stylish.variantBorderlessWithoutHover,
    filled: cx(
      stylish.variantOutlinedWithoutHover,
      css`
        background: ${token.colorFillQuaternary};
      `,
    ),
    mobile: css`
      padding-block: 0;
      padding-inline: 16px;
      background: ${token.colorBgContainer};
      border-radius: 0;
    `,
    outlined: stylish.variantOutlinedWithoutHover,
    root: css`
      overflow: hidden;
      padding-inline: 16px;
      border-radius: ${token.borderRadiusLG}px;
    `,
  };
});

export interface FormFlatGroupProps extends FlexboxProps {
  variant?: FormVariant;
}

const FormFlatGroup = forwardRef<HTMLDivElement, FormFlatGroupProps>(
  ({ className, children, variant = 'borderless', ...rest }, ref) => {
    const { mobile } = useResponsive();
    const { cx, styles } = useStyles(variant);

    const vriants = useMemo(
      () =>
        cva(styles.root, {
          defaultVariants: {
            variant: 'borderless',
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            variant: {
              filled: styles.filled,
              outlined: styles.outlined,
              borderless: styles.borderless,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    return (
      <Flexbox
        className={cx(mobile ? styles.mobile : vriants({ variant }), className)}
        ref={ref}
        {...rest}
      >
        {children}
      </Flexbox>
    );
  },
);

FormFlatGroup.displayName = 'FormFlatGroup';

export default FormFlatGroup;
