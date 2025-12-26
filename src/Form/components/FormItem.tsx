'use client';

import { Form } from 'antd';
import { cx } from 'antd-style';
import { memo, useMemo } from 'react';

import { itemVariants } from '../style';
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
    const cssVariables = useMemo<Record<string, string>>(
      () => ({
        '--form-item-min-width':
          minWidth !== undefined && minWidth !== null && minWidth !== ''
            ? typeof minWidth === 'number'
              ? `${minWidth}px`
              : minWidth
            : '',
      }),
      [minWidth],
    );

    const hasMinWidth = minWidth !== undefined && minWidth !== null && minWidth !== '';
    const { style: restStyle, ...restProps } = rest;

    return (
      <>
        {divider && <FormDivider visible={variant !== 'borderless'} />}
        <Item
          className={cx(itemVariants({ divider, itemMinWidth: hasMinWidth, layout }), className)}
          label={<FormTitle avatar={avatar} desc={desc} tag={tag} title={label} />}
          layout={layout}
          style={{
            ...cssVariables,
            ...restStyle,
          }}
          {...restProps}
        >
          {children}
        </Item>
      </>
    );
  },
);

FormItem.displayName = 'FormItem';

export default FormItem;
