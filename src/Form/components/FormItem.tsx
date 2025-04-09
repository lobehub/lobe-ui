'use client';

import { Form } from 'antd';
import { cva } from 'class-variance-authority';
import { memo, useMemo } from 'react';

import { useItemStyles as useStyles } from '../style';
import type { FormItemProps } from '../type';
import FormDivider from './FormDivider';
import FormTitle from './FormTitle';

const { Item } = Form;

const FormItem = memo<FormItemProps>(
  ({
    desc,
    tag,
    minWidth,
    avatar,
    className,
    label,
    children,
    divider,
    layout,
    variant,
    ...rest
  }) => {
    const { cx, styles } = useStyles({ minWidth });

    const variants = useMemo(
      () =>
        cva(styles.root, {
          defaultVariants: {
            divider: false,
            itemMinWidth: false,
            layout: 'vertical',
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            itemMinWidth: {
              true: styles.itemMinWidth,
              false: null,
            },
            divider: {
              true: null,
              false: styles.itemNoDivider,
            },
            layout: {
              vertical: styles.verticalLayout,
              horizontal: null,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    return (
      <>
        {divider && <FormDivider visible={variant !== 'borderless'} />}
        <Item
          className={cx(variants({ divider, itemMinWidth: Boolean(minWidth), layout }), className)}
          label={<FormTitle avatar={avatar} desc={desc} tag={tag} title={label} />}
          layout={layout}
          {...rest}
        >
          {children}
        </Item>
      </>
    );
  },
);

FormItem.displayName = 'FormItem';

export default FormItem;
