import { FormItemProps as AntdFormItemProps, Form } from 'antd';
import { createStyles } from 'antd-style';
import { isNumber } from 'lodash-es';
import { memo } from 'react';

import FormDivider from './FormDivider';
import FormTitle, { type FormTitleProps } from './FormTitle';

const { Item } = Form;

export const useStyles = createStyles(
  ({ css, responsive, prefixCls }, itemMinWidth?: string | number) => ({
    item: css`
      &.${prefixCls}-form-item {
        padding-block: 16px;
        padding-inline: 0;

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
        width: ${isNumber(itemMinWidth) ? `${itemMinWidth}px` : itemMinWidth};
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
  }),
);

export interface FormItemProps extends AntdFormItemProps {
  avatar?: FormTitleProps['avatar'];
  desc?: FormTitleProps['desc'];
  divider?: boolean;
  hidden?: boolean;
  minWidth?: string | number;
  tag?: FormTitleProps['tag'];
}

const FormItem = memo<FormItemProps>(
  ({ desc, tag, minWidth, avatar, className, label, children, divider, ...rest }) => {
    const { cx, styles } = useStyles(minWidth);
    return (
      <>
        {divider && <FormDivider />}
        <Item
          className={cx(
            styles.item,
            Boolean(minWidth) && styles.itemMinWidth,
            !divider && styles.itemNoDivider,
            className,
          )}
          label={<FormTitle avatar={avatar} desc={desc} tag={tag} title={label as any} />}
          {...rest}
        >
          {children}
        </Item>
      </>
    );
  },
);

export default FormItem;
