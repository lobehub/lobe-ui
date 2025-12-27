'use client';

import { Form as AntForm } from 'antd';
import { cx, useResponsive } from 'antd-style';
import { isUndefined } from 'es-toolkit/compat';
import { memo, useCallback, useState } from 'react';

import FormFlatGroup from './components/FormFlatGroup';
import FormGroup from './components/FormGroup';
import FormItem from './components/FormItem';
import { FormProvider } from './components/FormProvider';
import { variants } from './style';
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
    itemVariant,
    variant = 'borderless',
    classNames,
    styles: customStyles,
    gap,
    style,
    collapsible,
    defaultActiveKey,
    initialValues,
    activeKey,
    onCollapse,
    onFinish,
    ref,
    layout,
    ...rest
  }) => {
    const { mobile } = useResponsive();
    const [submitLoading, setSubmitLoading] = useState(false);

    const mapFlat = useCallback(
      (item: FormItemProps, itemIndex: number) => (
        <FormItem
          className={classNames?.item}
          divider={itemIndex !== 0}
          key={itemIndex}
          minWidth={itemMinWidth}
          style={customStyles?.item}
          variant={variant}
          {...item}
        />
      ),
      [itemMinWidth, variant, classNames, customStyles],
    );

    const mapTree = useCallback(
      (group: FormGroupItemType, groupIndex: number) => {
        const key = group?.key || groupIndex;
        return (
          <FormGroup
            active={activeKey && group?.key ? activeKey.includes(key) : undefined}
            className={classNames?.group}
            classNames={classNames}
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
            style={customStyles?.group}
            styles={customStyles}
            title={group.title}
            variant={group?.variant || variant}
          >
            {Array.isArray(group.children)
              ? group.children.filter((item) => !item.hidden).map((item, i) => mapFlat(item, i))
              : group.children}
          </FormGroup>
        );
      },
      [activeKey, collapsible, defaultActiveKey, onCollapse, variant, classNames, customStyles],
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
          layout={layout || (mobile ? 'vertical' : 'horizontal')}
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
          variant={itemVariant}
          {...rest}
        >
          {items && items?.length > 0 ? (
            itemsType === 'group' ? (
              (items as FormGroupItemType[])?.map((item, i) => mapTree(item, i))
            ) : (
              <FormFlatGroup
                className={classNames?.group}
                style={customStyles?.group}
                variant={variant}
              >
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
