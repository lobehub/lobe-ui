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
      padding-block: 16px;
      padding-inline: 0;

      .${prefixCls}-row {
        justify-content: space-between;

        > div {
          flex: unset !important;
          flex-grow: unset !important;
        }
      }

      .${prefixCls}-form-item-required::before {
        align-self: flex-start;
      }

      ${itemMinWidth &&
      css`
        .${prefixCls}-form-item-control {
          width: ${isNumber(itemMinWidth) ? `${itemMinWidth}px` : itemMinWidth};
        }
      `}

      ${responsive.mobile} {
        padding-block: 16px;
        padding-inline: 0;

        ${itemMinWidth
          ? css`
              .${prefixCls}-row {
                flex-direction: column;
                gap: 4px;
              }

              .${prefixCls}-form-item-control {
                flex: 1;
                width: 100%;
              }
            `
          : css`
              .${prefixCls}-row {
                flex-wrap: wrap;
                gap: 4px;
              }
            `}
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
          className={cx(styles.item, !divider && styles.itemNoDivider, className)}
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
