'use client';

import { Divider as AntDivider } from 'antd';
import { createStaticStyles, cx } from 'antd-style';
import { type FC } from 'react';

import type { FormDividerProps } from '../type';

const styles = createStaticStyles(({ css }) => {
  return {
    root: css`
      margin: 0;
      opacity: 0.66;
    `,
  };
});

const FormDivider: FC<FormDividerProps> = ({ visible = true, style, className, ...rest }) => {
  return (
    <AntDivider
      className={cx(styles.root, className)}
      style={{
        opacity: visible ? 1 : 0,
        ...style,
      }}
      {...rest}
    />
  );
};

FormDivider.displayName = 'FormDivider';

export default FormDivider;
