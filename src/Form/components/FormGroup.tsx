'use client';

import { createStyles, useResponsive } from 'antd-style';
import { isUndefined } from 'lodash-es';
import { type ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Collapse, { type CollapseProps } from '@/Collapse';
import type { FormItemProps } from '@/Form/components/FormItem';
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

export interface ItemGroup {
  children: FormItemProps[] | ReactNode;
  collapsible?: boolean;
  defaultActive?: boolean;
  extra?: ReactNode;
  icon?: IconProps['icon'];
  key?: string;
  title: ReactNode;
  variant?: FormVariant;
}

export interface FormGroupProps
  extends Omit<CollapseProps, 'collapsible' | 'items' | 'defaultActiveKey' | 'activeKey'> {
  active?: boolean;
  children: ReactNode;
  collapsible?: boolean;
  defaultActive?: boolean;
  extra?: ReactNode;
  icon?: IconProps['icon'];
  keyValue?: string | number;
  onCollapse?: (active: boolean) => void;
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
    variant = 'default',
    defaultActive = true,
    collapsible,
    active,
    keyValue = 'group',
    onCollapse,
    ...rest
  }) => {
    const { mobile } = useResponsive();
    const { cx, styles, prefixCls } = useStyles(variant);

    const groupClassName = `${prefixCls}-form-group`;
    const groupTitleClassName = `${prefixCls}-form-group-title`;
    const groupHeaderClassName = `${prefixCls}-form-group-header`;
    const groupContentClassName = `${prefixCls}-form-group-content`;

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
        activeKey={isUndefined(active) ? undefined : active ? [keyValue] : []}
        className={cx(groupClassName, className)}
        collapsible={defaultCollapsible}
        defaultActiveKey={defaultActive ? [keyValue] : undefined}
        items={[
          {
            children,
            extra,
            key: keyValue,
            label: titleContent,
          },
        ]}
        onChange={(v) => onCollapse?.(v.length > 0)}
        variant={variant}
        {...rest}
      />
    );
  },
);

export default FormGroup;
