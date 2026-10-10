'use client';

import { Collapsible } from '@base-ui/react/collapsible';
import * as stylex from '@stylexjs/stylex';
import { ChevronDown } from 'lucide-react';
import { memo, type ReactNode } from 'react';

import Icon from '@/Icon';
import { focusRing } from '@/styles/stylex/focusRing';
import { styleProps } from '@/styles/stylex/props';
import { stylish } from '@/styles/stylex/stylish';
import { useResponsive, useThemeMode } from '@/styles/theme/scope';

import { formGroupTriggerMarker } from '../marker.stylex';
import { groupStyles } from '../style';
import type { FormGroupProps } from '../type';

const GroupTitle = memo<{
  desc?: ReactNode;
  icon?: FormGroupProps['icon'];
  mobile?: boolean;
  title?: ReactNode;
  variant?: FormGroupProps['variant'];
}>(({ icon, title, desc, variant, mobile }) => (
  <div
    {...stylex.props(
      groupStyles.title,
      variant === 'borderless' && !mobile && groupStyles.titleBorderless,
      mobile && groupStyles.mobileTitle,
    )}
  >
    {icon && <Icon icon={icon} />}
    <div>
      {title}
      {desc && <div {...stylex.props(groupStyles.desc)}>{desc}</div>}
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
    const { isDarkMode } = useThemeMode();
    const isFilled = variant === 'filled';
    const rootProps = styleProps(
      [
        isFilled && groupStyles.rootFilled,
        isFilled && isDarkMode && groupStyles.rootFilledDark,
        variant === 'outlined' && [stylish.variantOutlinedWithoutHover, groupStyles.rootOutlined],
      ],
      className,
    );
    const bodyProps = stylex.props(
      groupStyles.body,
      !isBorderless && groupStyles.bodyBoxed,
      isFilled && [stylish.variantOutlinedWithoutHover, groupStyles.bodyFilled],
      isFilled && !isDarkMode && groupStyles.bodyFilledLight,
    );
    const headerProps = stylex.props(
      groupStyles.header,
      isBorderless ? groupStyles.headerBorderless : groupStyles.headerBoxed,
    );

    if (mobile)
      return (
        <div className={className} {...rest}>
          <div {...stylex.props(groupStyles.header, groupStyles.mobileHeader)}>
            <GroupTitle mobile desc={desc} icon={icon} title={title} />
            {extra}
          </div>
          <div {...stylex.props(groupStyles.mobileBody)}>{children}</div>
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
            {...stylex.props(formGroupTriggerMarker, focusRing.info, groupStyles.trigger)}
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
