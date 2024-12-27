'use client';

import { createStyles, useResponsive } from 'antd-style';
import { isUndefined } from 'lodash-es';
import { type ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Collapse, { type CollapseProps } from '@/Collapse';
import Icon, { type IconProps } from '@/Icon';

export type FormVariant = 'default' | 'block' | 'ghost' | 'pure';
export type ItemsType = 'group' | 'flat';

export const useStyles = createStyles(({ css, token, responsive }) => {
  return {
    blockStyle: css`
      background: ${token.colorFillQuaternary};
      border: none;
      border-radius: ${token.borderRadiusLG}px;
    `,
    defaultStyle: css`
      background: ${token.colorFillQuaternary};
      border: 1px solid ${token.colorBorderSecondary};
      border-radius: ${token.borderRadiusLG}px;
    `,
    flatGroup: css`
      overflow: hidden;
      padding-inline: 16px;
    `,
    ghostStyle: css`
      background: transparent;
      border: 1px solid ${token.colorBorderSecondary};
    `,
    icon: css`
      transition: all 100ms ${token.motionEaseOut};
    `,
    mobileFlatGroup: css`
      border-radius: ${token.borderRadiusLG}px;
    `,
    mobileGroupBody: css`
      padding-block: 0;
      padding-inline: 16px;
      background: ${token.colorBgContainer};
    `,
    mobileGroupHeader: css`
      padding: 16px;
      background: ${token.colorBgLayout};
    `,
    pureStyle: css`
      padding: 0;
      background: transparent;
      border: none;
      border-radius: 0;
    `,
    pureTitle: css`
      font-size: 18px;
      font-weight: 700;
      line-height: 24px;
    `,
    title: css`
      align-items: center;
      font-size: 16px;
      font-weight: 600;

      .anticon {
        color: ${token.colorPrimary};
      }

      ${responsive.mobile} {
        font-size: 14px;
        font-weight: 400;
        opacity: 0.5;
      }
    `,
  };
});

export interface FormGroupProps extends Omit<CollapseProps, 'collapsible'> {
  children: ReactNode;
  collapsible?: boolean;
  defaultActive?: boolean;
  extra?: ReactNode;
  icon?: IconProps['icon'];
  itemsType?: ItemsType;
  title?: ReactNode;
  variant?: FormVariant;
}

const FormGroup = memo<FormGroupProps>(
  ({
    className,
    icon,
    title,
    children,
    extra,
    itemsType,
    variant = 'default',
    defaultActive = true,
    collapsible,
    ...rest
  }) => {
    const { mobile } = useResponsive();
    const { cx, styles, prefixCls } = useStyles(variant);

    const groupClassName = `${prefixCls}-form-group`;
    const groupTitleClassName = `${prefixCls}-form-group-title`;
    const groupHeaderClassName = `${prefixCls}-form-group-header`;
    const groupContentClassName = `${prefixCls}-form-group-content`;

    const variantStyle = cx(
      variant === 'default' && styles.defaultStyle,
      variant === 'block' && styles.blockStyle,
      variant === 'ghost' && styles.ghostStyle,
      variant === 'pure' && styles.pureStyle,
    );

    const defaultCollapsible = isUndefined(collapsible) ? variant !== 'pure' : collapsible;

    const titleContent = (
      <Flexbox
        className={cx(groupTitleClassName, styles.title, variant === 'pure' && styles.pureTitle)}
        gap={8}
        horizontal
      >
        {icon && <Icon icon={icon} />}
        {title}
      </Flexbox>
    );

    if (itemsType === 'flat') {
      return mobile ? (
        <Flexbox
          className={cx(groupClassName, styles.mobileFlatGroup, styles.mobileGroupBody, className)}
        >
          {children}
        </Flexbox>
      ) : (
        <Flexbox className={cx(groupClassName, styles.flatGroup, variantStyle, className)}>
          {children}
        </Flexbox>
      );
    }

    if (mobile)
      return (
        <Flexbox className={cx(groupClassName, className)}>
          <Flexbox
            className={cx(groupHeaderClassName, styles.mobileGroupHeader)}
            horizontal
            justify={'space-between'}
          >
            {titleContent}
            {extra}
          </Flexbox>
          <div className={cx(groupContentClassName, styles.mobileGroupBody)}>{children}</div>
        </Flexbox>
      );

    return (
      <Collapse
        className={cx(groupClassName, className)}
        collapsible={defaultCollapsible}
        defaultActiveKey={defaultActive ? [1] : undefined}
        items={[
          {
            children,
            extra,
            key: 1,
            label: titleContent,
          },
        ]}
        key={1}
        variant={variant}
        {...rest}
      />
    );
  },
);

export default FormGroup;
