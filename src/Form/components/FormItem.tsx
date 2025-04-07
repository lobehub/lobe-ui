'use client';

import { FormItemProps as AntdFormItemProps, Form } from 'antd';
import { createStyles } from 'antd-style';
import { cva } from 'class-variance-authority';
import { isNumber } from 'lodash-es';
import { memo, useMemo } from 'react';

import { FormVariant } from '../type';
import FormDivider from './FormDivider';
import FormTitle, { type FormTitleProps } from './FormTitle';

const { Item } = Form;

export const useStyles = createStyles(
  ({ css, responsive, prefixCls }, { minWidth }: { minWidth?: string | number }) => ({
    itemMinWidth: css`
      .${prefixCls}-form-item-control {
        width: ${isNumber(minWidth) ? `${minWidth}px` : minWidth};
      }
      ${responsive.mobile} {
        .${prefixCls}-row {
          flex-direction: column;
          gap: 4px;
        }

        .${prefixCls}-form-item-control {
          flex: 1;
          width: 100%;
        }
      }
    `,
    itemNoDivider: css`
      &:not(:first-child) {
        padding-block-start: 0;
      }
    `,
    root: css`
      &.${prefixCls}-form-item {
        padding-block: 16px;
        padding-inline: 0;

        .${prefixCls}-form-item-label {
          text-align: start;
        }

        .${prefixCls}-row {
          gap: 12px;
          justify-content: space-between;

          > div {
            flex: unset;
            flex-grow: unset;
          }
        }

        .${prefixCls}-form-item-required::before {
          align-self: flex-start;
        }

        ${responsive.md} {
          .${prefixCls}-row {
            flex-direction: column;
            align-items: stretch;

            > div {
              width: 100%;
            }
          }
        }

        ${responsive.mobile} {
          padding-block: 16px;
          padding-inline: 0;

          .${prefixCls}-row {
            flex-wrap: wrap;
            gap: 4px;
          }
        }
      }
    `,
    verticalLayout: css`
      &.${prefixCls}-form-item {
        .${prefixCls}-row {
          align-items: stretch;
        }
      }
    `,
  }),
);

export interface FormItemProps extends AntdFormItemProps {
  avatar?: FormTitleProps['avatar'];
  desc?: FormTitleProps['desc'];
  divider?: boolean;
  hidden?: boolean;
  minWidth?: string | number;
  tag?: FormTitleProps['tag'];
  variant?: FormVariant;
}

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
