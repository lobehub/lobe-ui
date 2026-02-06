'use client';

import { cx, useResponsive } from 'antd-style';
import { isUndefined } from 'es-toolkit/compat';
import { memo } from 'react';

import Collapse from '@/Collapse';
import { Flexbox } from '@/Flex';
import Icon from '@/Icon';

import { groupStyles, titleVariants } from '../style';
import type { FormGroupProps } from '../type';

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
    keyValue = 'group',
    onCollapse,
    desc,
    ...rest
  }) => {
    const { mobile } = useResponsive();
    const styles = groupStyles;
    const isBorderless = variant === 'borderless';

    const defaultCollapsible = isUndefined(collapsible) ? !isBorderless : collapsible;

    const titleContent = (
      <Flexbox horizontal className={cx(titleVariants({ variant }), styles.titleMobile)} gap={8}>
        {icon && <Icon icon={icon} />}
        {title}
      </Flexbox>
    );

    if (mobile)
      return (
        <Flexbox className={className}>
          <Flexbox horizontal className={styles.mobileGroupHeader} justify={'space-between'}>
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
        variant={variant}
        classNames={{
          header: isBorderless ? styles.titleBorderless : undefined,
          title: isBorderless ? styles.titleBorderless : undefined,
        }}
        items={[
          {
            children,
            desc,
            extra,
            icon,
            key: keyValue,
            label: title,
          },
        ]}
        onChange={(v) => onCollapse?.(v.length > 0)}
        {...rest}
      />
    );
  },
);

FormGroup.displayName = 'FormGroup';

export default FormGroup;
