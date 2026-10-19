'use client';

import { Collapsible } from '@base-ui/react/collapsible';
import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { memo, type ReactNode } from 'react';

import Icon from '@/Icon';
import { focusRing } from '@/styles/stylex/focusRing';
import { styleProps } from '@/styles/stylex/props';
import { stylish } from '@/styles/stylex/stylish';
import { useResponsive, useThemeMode } from '@/styles/theme/scope';

import { formGroupTriggerMarker } from '../marker.stylex';
import { useFormClasses } from '../stableContext';
import { groupStyles } from '../style';
import type { FormGroupProps } from '../type';

const GroupTitle = memo<{
  desc?: ReactNode;
  icon?: FormGroupProps['icon'];
  mobile?: boolean;
  title?: ReactNode;
  variant?: FormGroupProps['variant'];
}>(({ icon, title, desc, variant, mobile }) => {
  const formClasses = useFormClasses();
  return (
    <div
      {...styleProps(
        [
          groupStyles.title,
          variant === 'borderless' && !mobile && groupStyles.titleBorderless,
          mobile && groupStyles.mobileTitle,
        ],
        formClasses('group-title'),
      )}
    >
      {icon && <Icon icon={icon} />}
      <div>
        {title}
        {desc && <div {...styleProps(groupStyles.desc, formClasses('group-desc'))}>{desc}</div>}
      </div>
    </div>
  );
});

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
    const formClasses = useFormClasses();
    const { mobile } = useResponsive();
    const isBorderless = variant === 'borderless';
    const isCollapsible = collapsible === undefined ? !isBorderless : collapsible;
    const { isDarkMode } = useThemeMode();
    const isFilled = variant === 'filled';
    const rootProps = styleProps(
      [
        isFilled && groupStyles.rootFilled,
        isFilled && isDarkMode && groupStyles.rootFilledDark,
        variant === 'outlined' && [stylish.variantOutlinedWithoutHover, groupStyles.rootOutlined],
      ],
      clsx(formClasses('group'), className),
    );
    const bodyProps = styleProps(
      [
        groupStyles.body,
        !isBorderless && groupStyles.bodyBoxed,
        isFilled && [stylish.variantOutlinedWithoutHover, groupStyles.bodyFilled],
        isFilled && !isDarkMode && groupStyles.bodyFilledLight,
      ],
      formClasses('group-body'),
    );
    const headerProps = styleProps(
      [groupStyles.header, isBorderless ? groupStyles.headerBorderless : groupStyles.headerBoxed],
      formClasses('group-header'),
    );

    if (mobile)
      return (
        <div className={clsx(formClasses('group'), className)} {...rest}>
          <div
            {...styleProps(
              [groupStyles.header, groupStyles.mobileHeader],
              formClasses('group-header'),
            )}
          >
            <GroupTitle mobile desc={desc} icon={icon} title={title} />
            {extra}
          </div>
          <div {...styleProps(groupStyles.mobileBody, formClasses('group-body'))}>{children}</div>
        </div>
      );

    if (!isCollapsible)
      return (
        <div {...rootProps} {...rest}>
          {title && (
            <div {...headerProps}>
              <GroupTitle desc={desc} icon={icon} title={title} variant={variant} />
              {extra}
            </div>
          )}
          <div data-form-group-body {...bodyProps}>
            {children}
          </div>
        </div>
      );

    return (
      <Collapsible.Root
        {...rootProps}
        defaultOpen={defaultActive}
        open={active}
        onOpenChange={onCollapse}
        {...rest}
      >
        <div {...headerProps}>
          <Collapsible.Trigger
            {...styleProps(
              [formGroupTriggerMarker, focusRing.info, groupStyles.trigger],
              formClasses('group-trigger'),
            )}
          >
            <GroupTitle desc={desc} icon={icon} title={title} variant={variant} />
            <Icon {...stylex.props(groupStyles.chevron)} icon={ChevronDown} />
          </Collapsible.Trigger>
          {extra}
        </div>
        <Collapsible.Panel {...stylex.props(groupStyles.panel)}>
          <div data-form-group-body {...bodyProps}>
            {children}
          </div>
        </Collapsible.Panel>
      </Collapsible.Root>
    );
  },
);

FormGroup.displayName = 'FormGroup';

export default FormGroup;
