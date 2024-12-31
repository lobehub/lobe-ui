'use client';

import { useResponsive } from 'antd-style';
import { memo } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

import { FormVariant, useStyles } from './FormGroup';

export interface FormFlatGroupProps extends FlexboxProps {
  variant?: FormVariant;
}

const FormFlatGroup = memo<FormFlatGroupProps>(
  ({ className, children, variant = 'default', ...rest }) => {
    const { mobile } = useResponsive();
    const { cx, styles, prefixCls } = useStyles(variant);

    const groupClassName = `${prefixCls}-form-group`;

    const variantStyle = cx(
      variant === 'default' && styles.defaultStyle,
      variant === 'block' && styles.blockStyle,
      variant === 'ghost' && styles.ghostStyle,
      variant === 'pure' && styles.pureStyle,
    );

    return mobile ? (
      <Flexbox
        className={cx(groupClassName, styles.mobileFlatGroup, styles.mobileGroupBody, className)}
        {...rest}
      >
        {children}
      </Flexbox>
    ) : (
      <Flexbox className={cx(groupClassName, styles.flatGroup, variantStyle, className)} {...rest}>
        {children}
      </Flexbox>
    );
  },
);

export default FormFlatGroup;
