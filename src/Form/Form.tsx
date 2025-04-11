'use client';

import { Form as AntForm } from 'antd';
import { cva } from 'class-variance-authority';
import { isUndefined } from 'lodash-es';
import { memo, useCallback, useMemo, useState } from 'react';

import FormFlatGroup from './components/FormFlatGroup';
import FormGroup from './components/FormGroup';
import FormItem from './components/FormItem';
import { FormProvider } from './components/FormProvider';
import { useStyles } from './style';
import type { FormGroupItemType, FormItemProps, FormProps } from './type';

const Form = memo<FormProps>(
  ({
    className,
    itemMinWidth,
    footer,
    form,
    items = [],
    children,
    itemsType = 'group',
    variant = 'borderless',
    gap,
    style,
    collapsible,
    defaultActiveKey,
    initialValues,
    activeKey,
    onCollapse,
    onFinish,
    ref,
    ...rest
  }) => {
    const { cx, styles } = useStyles();
    const [submitLoading, setSubmitLoading] = useState(false);

    const variants = useMemo(
      () =>
        cva(styles.root, {
          defaultVariants: {
            variant: 'borderless',
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            variant: {
              filled: null,
              outlined: null,
              borderless: styles.borderless,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    const mapFlat = useCallback(
      (item: FormItemProps, itemIndex: number) => (
        <FormItem
          divider={itemIndex !== 0}
          key={itemIndex}
          minWidth={itemMinWidth}
          variant={variant}
          {...item}
        />
      ),
      [itemMinWidth, variant],
    );

    const mapTree = useCallback(
      (group: FormGroupItemType, groupIndex: number) => {
        const key = group?.key || groupIndex;
        return (
          <FormGroup
            active={activeKey && group?.key ? activeKey.includes(key) : undefined}
            collapsible={isUndefined(group.collapsible) ? collapsible : group.collapsible}
            defaultActive={
              defaultActiveKey && group?.key ? defaultActiveKey.includes(key) : group?.defaultActive
            }
            extra={group?.extra}
            icon={group?.icon}
            key={key}
            keyValue={key}
            onCollapse={(active) => {
              let keys: (string | number)[] = activeKey || defaultActiveKey || [];
              keys = keys.filter((k) => k !== key);
              onCollapse?.(active ? [...keys, key] : keys);
            }}
            title={group.title}
            variant={group?.variant || variant}
          >
            {Array.isArray(group.children)
              ? group.children.filter((item) => !item.hidden).map((item, i) => mapFlat(item, i))
              : group.children}
          </FormGroup>
        );
      },
      [activeKey, collapsible, defaultActiveKey, onCollapse, variant],
    );

    return (
      <FormProvider
        config={{
          form,
          initialValues,
          submitLoading,
        }}
      >
        <AntForm
          className={cx(variants({ variant }), className)}
          colon={false}
          form={form}
          initialValues={initialValues}
          layout={'horizontal'}
          onFinish={async (...finishProps) => {
            if (!onFinish) return;
            setSubmitLoading(true);
            await onFinish(...finishProps);
            setSubmitLoading(false);
          }}
          ref={ref}
          style={{
            gap,
            ...style,
          }}
          variant={'filled'}
          {...rest}
        >
          {items && items?.length > 0 ? (
            itemsType === 'group' ? (
              (items as FormGroupItemType[])?.map((item, i) => mapTree(item, i))
            ) : (
              <FormFlatGroup variant={variant}>
                {(items as FormItemProps[])
                  ?.filter((item) => !item.hidden)
                  .map((item, i) => mapFlat(item, i))}
              </FormFlatGroup>
            )
          ) : undefined}
          {children}
          {footer}
        </AntForm>
      </FormProvider>
    );
  },
);

Form.displayName = 'Form';

export default Form;
