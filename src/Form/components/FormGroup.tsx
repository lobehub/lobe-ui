'use client';

import { useResponsive } from 'antd-style';
import { cva } from 'class-variance-authority';
import { isUndefined } from 'lodash-es';
import { memo, useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Collapse from '@/Collapse';
import Icon from '@/Icon';

import { useGroupStyles as useStyles } from '../style';
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
    ...rest
  }) => {
    const { mobile } = useResponsive();
    const { cx, styles } = useStyles(variant);
    const isBorderless = variant === 'borderless';

    const defaultCollapsible = isUndefined(collapsible) ? !isBorderless : collapsible;

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
        <Flexbox className={className}>
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
        variant={variant}
        {...rest}
      />
    );
  },
);

FormGroup.displayName = 'FormGroup';

export default FormGroup;
