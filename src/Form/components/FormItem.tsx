'use client';

import { FormItemProps as AntdFormItemProps, Form } from 'antd';
import { createStyles } from 'antd-style';
import { isNumber } from 'lodash-es';
import { memo } from 'react';

import { FormVariant } from '@/Form/components/FormGroup';

import FormDivider from './FormDivider';
import FormTitle, { type FormTitleProps } from './FormTitle';

const { Item } = Form;

export const useStyles = createStyles(
  ({ css, responsive, prefixCls }, { minWidth }: { minWidth?: string | number }) => ({
    item: css`
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
    const isVertical = layout === 'vertical';
    return (
      <>
        {divider && (
          <FormDivider
            style={{
              opacity: variant === 'pure' ? 0 : undefined,
            }}
          />
        )}
        <Item
          className={cx(
            styles.item,
            Boolean(minWidth) && styles.itemMinWidth,
            !divider && styles.itemNoDivider,
            isVertical && styles.verticalLayout,
            className,
          )}
          label={<FormTitle avatar={avatar} desc={desc} tag={tag} title={label as any} />}
          layout={layout}
          {...rest}
        >
          {children}
        </Item>
      </>
    );
  },
);

export default FormItem;
