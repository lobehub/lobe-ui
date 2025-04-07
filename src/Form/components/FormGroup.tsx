'use client';

import { createStyles, useResponsive } from 'antd-style';
import { cva } from 'class-variance-authority';
import { isUndefined } from 'lodash-es';
import { type ReactNode, forwardRef, useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Collapse, { type CollapseProps } from '@/Collapse';
import type { FormItemProps } from '@/Form/components/FormItem';
import Icon, { type IconProps } from '@/Icon';

import type { FormVariant } from '../type';

export const useStyles = createStyles(({ css, token, responsive }) => {
  return {
    mobileGroupBody: css`
      padding-block: 0;
      padding-inline: 16px;
      background: ${token.colorBgContainer};
    `,
    mobileGroupHeader: css`
      padding: 16px;
      background: ${token.colorBgLayout};
    `,
    title: css`
      align-items: center;
      font-size: 16px;
      font-weight: 600;
    `,
    titleBorderless: css`
      font-size: 18px;
      font-weight: 700;
      line-height: 24px;
    `,
    titleMobile: css`
      ${responsive.mobile} {
        font-size: 14px;
        font-weight: 400;
        opacity: 0.5;
      }
    `,
  };
});

export interface FormGroupItem {
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

const FormGroup = forwardRef<HTMLDivElement, FormGroupProps>(
  (
    {
      className,
      icon,
      title,
      children,
      extra,
      variant = 'borderless',
      defaultActive = true,
      collapsible,
      active,
      keyValue = 'group',
      onCollapse,
      ...rest
    },
    ref,
  ) => {
    const { mobile } = useResponsive();
    const { cx, styles } = useStyles(variant);
    const isBorderless = variant === 'borderless';

    const defaultCollapsible = isUndefined(collapsible) ? isBorderless : collapsible;

    const titleVariants = useMemo(
      () =>
        cva(styles.title, {
          defaultVariants: {
            variant: 'borderless',
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            variant: {
              filled: null,
              outlined: null,
              borderless: styles.titleBorderless,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    const titleContent = (
      <Flexbox className={cx(titleVariants({ variant }), styles.titleMobile)} gap={8} horizontal>
        {icon && <Icon icon={icon} />}
        {title}
      </Flexbox>
    );

    if (mobile)
      return (
        <Flexbox className={className} ref={ref}>
          <Flexbox className={styles.mobileGroupHeader} horizontal justify={'space-between'}>
            {titleContent}
            {extra}
          </Flexbox>
          <div className={styles.mobileGroupBody}>{children}</div>
        </Flexbox>
      );

    return (
      <Collapse
        activeKey={isUndefined(active) ? undefined : active ? [keyValue] : []}
        className={className}
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
        ref={ref}
        variant={variant}
        {...rest}
      />
    );
  },
);

FormGroup.displayName = 'FormGroup';

export default FormGroup;
