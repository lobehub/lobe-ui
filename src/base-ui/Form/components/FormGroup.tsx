'use client';

import { Collapsible } from '@base-ui/react/collapsible';
import { cx, useResponsive } from 'antd-style';
import { ChevronDown } from 'lucide-react';
import { memo, type ReactNode } from 'react';

import Icon from '@/Icon';

import { groupStyles, groupVariants } from '../style';
import type { FormGroupProps } from '../type';

const GroupTitle = memo<{
  desc?: ReactNode;
  icon?: FormGroupProps['icon'];
  mobile?: boolean;
  title?: ReactNode;
  variant?: FormGroupProps['variant'];
}>(({ icon, title, desc, variant, mobile }) => (
  <div
    className={cx(
      groupStyles.title,
      variant === 'borderless' && !mobile && groupStyles.titleBorderless,
      mobile && groupStyles.mobileTitle,
    )}
  >
    {icon && <Icon icon={icon} />}
    <div>
      {title}
      {desc && <div className={groupStyles.desc}>{desc}</div>}
    </div>
  </div>
));

GroupTitle.displayName = 'GroupTitle';

const FormGroup = memo<FormGroupProps>(
  ({
    className,
    icon,
    title,
    children,
    extra,
    variant = 'borderless',
    defaultActive = true,
    collapsible,
    active,
    onCollapse,
    desc,
    keyValue: _keyValue,
    ...rest
  }) => {
    const { mobile } = useResponsive();
    const isBorderless = variant === 'borderless';
    const isCollapsible = collapsible === undefined ? !isBorderless : collapsible;

    if (mobile)
      return (
        <div className={className} {...rest}>
          <div className={cx(groupStyles.header, groupStyles.mobileHeader)}>
            <GroupTitle mobile desc={desc} icon={icon} title={title} />
            {extra}
          </div>
          <div className={groupStyles.mobileBody}>{children}</div>
        </div>
      );

    if (!isCollapsible)
      return (
        <div className={cx(groupVariants({ variant }), className)} {...rest}>
          {title && (
            <div
              className={cx(
                groupStyles.header,
                isBorderless ? groupStyles.headerBorderless : groupStyles.headerBoxed,
              )}
            >
              <GroupTitle desc={desc} icon={icon} title={title} variant={variant} />
              {extra}
            </div>
          )}
          <div className={cx(groupStyles.body, !isBorderless && groupStyles.bodyBoxed)}>
            {children}
          </div>
        </div>
      );

    return (
      <Collapsible.Root
        className={cx(groupVariants({ variant }), className)}
        defaultOpen={defaultActive}
        open={active}
        onOpenChange={onCollapse}
        {...rest}
      >
        <div
          className={cx(
            groupStyles.header,
            isBorderless ? groupStyles.headerBorderless : groupStyles.headerBoxed,
          )}
        >
          <Collapsible.Trigger className={groupStyles.trigger}>
            <GroupTitle desc={desc} icon={icon} title={title} variant={variant} />
            <Icon className={groupStyles.chevron} icon={ChevronDown} />
          </Collapsible.Trigger>
          {extra}
        </div>
        <Collapsible.Panel className={groupStyles.panel}>
          <div className={cx(groupStyles.body, !isBorderless && groupStyles.bodyBoxed)}>
            {children}
          </div>
        </Collapsible.Panel>
      </Collapsible.Root>
    );
  },
);

FormGroup.displayName = 'FormGroup';

export default FormGroup;
