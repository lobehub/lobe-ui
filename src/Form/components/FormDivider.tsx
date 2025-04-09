'use client';

import { Divider as AntDivider } from 'antd';
import { createStyles } from 'antd-style';
import { memo } from 'react';

import type { FormDividerProps } from '../type';

const useStyles = createStyles(({ css }) => {
  return {
    root: css`
      margin: 0;
      opacity: 0.66;
    `,
  };
});

const FormDivider = memo<FormDividerProps>(({ visible = true, style, className, ...rest }) => {
  const { cx, styles } = useStyles();
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
});

FormDivider.displayName = 'FormDivider';

export default FormDivider;
