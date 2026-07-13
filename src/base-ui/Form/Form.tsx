'use client';

import { Form as BaseForm } from '@base-ui/react/form';
import { cx, useResponsive } from 'antd-style';
import { isUndefined } from 'es-toolkit/compat';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import FormField from './components/FormField';
import FormFlatGroup from './components/FormFlatGroup';
import FormGroup from './components/FormGroup';
import { FormContext } from './context';
import { rootVariants } from './style';
import type { FormFieldProps, FormGroupItemType, FormProps } from './type';

const serializeForm = (form: HTMLFormElement | null) => {
  if (!form) return '';
  const entries = [...new FormData(form).entries()].filter(
    ([, value]) => typeof value === 'string',
  ) as [string, string][];
  return JSON.stringify(entries.sort((a, b) => a[0].localeCompare(b[0])));
};

const Form = memo<FormProps>(
  ({
    className,
    itemMinWidth,
    footer,
    items = [],
    children,
    itemsType = 'group',
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
    onFormSubmit,
    layout,
    ref,
    ...rest
  }) => {
    const { mobile } = useResponsive();
    const formRef = useRef<HTMLFormElement>(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const snapshotRef = useRef('');

    const syncUnsaved = useCallback(() => {
      setHasUnsavedChanges(serializeForm(formRef.current) !== snapshotRef.current);
    }, []);

    useEffect(() => {
      const form = formRef.current;
      if (!form) return;
      snapshotRef.current = serializeForm(form);
      let resetTimer: ReturnType<typeof setTimeout>;
      const handleMutation = () => syncUnsaved();
      const handleReset = () => {
        resetTimer = setTimeout(() => {
          snapshotRef.current = serializeForm(formRef.current);
          syncUnsaved();
        }, 0);
      };
      form.addEventListener('input', handleMutation);
      form.addEventListener('change', handleMutation);
      form.addEventListener('reset', handleReset);
      return () => {
        clearTimeout(resetTimer);
        form.removeEventListener('input', handleMutation);
        form.removeEventListener('change', handleMutation);
        form.removeEventListener('reset', handleReset);
      };
    }, [syncUnsaved]);

    const requestReset = useCallback(() => {
      formRef.current?.reset();
    }, []);

    const mergedRef = useCallback(
      (node: HTMLFormElement | null) => {
        formRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const context = useMemo(
      () => ({
        hasUnsavedChanges,
        initialValues,
        itemMinWidth,
        layout: layout || (mobile ? ('vertical' as const) : ('horizontal' as const)),
        requestReset,
        submitLoading,
        variant,
      }),
      [
        hasUnsavedChanges,
        initialValues,
        itemMinWidth,
        layout,
        mobile,
        requestReset,
        submitLoading,
        variant,
      ],
    );

    const mapFlat = useCallback(
      (item: FormFieldProps, itemIndex: number) => (
        <FormField
          className={classNames?.item}
          divider={itemIndex !== 0}
          key={itemIndex}
          style={customStyles?.item}
          variant={variant}
          {...item}
        />
      ),
      [variant, classNames, customStyles],
    );

    const mapTree = useCallback(
      (group: FormGroupItemType, groupIndex: number) => {
        const key = group?.key || groupIndex;
        return (
          <FormGroup
            active={activeKey && group?.key ? activeKey.includes(key) : undefined}
            className={classNames?.group}
            collapsible={isUndefined(group.collapsible) ? collapsible : group.collapsible}
            desc={group?.desc}
            extra={group?.extra}
            icon={group?.icon}
            key={key}
            style={customStyles?.group}
            title={group.title}
            variant={group?.variant || variant}
            defaultActive={
              defaultActiveKey && group?.key ? defaultActiveKey.includes(key) : group?.defaultActive
            }
            onCollapse={(active) => {
              let keys: (string | number)[] = activeKey || defaultActiveKey || [];
              keys = keys.filter((k) => k !== key);
              onCollapse?.(active ? [...keys, key] : keys);
            }}
          >
            {Array.isArray(group.children)
              ? group.children.filter((item) => !item.hidden).map((item, i) => mapFlat(item, i))
              : group.children}
          </FormGroup>
        );
      },
      [
        activeKey,
        collapsible,
        defaultActiveKey,
        onCollapse,
        variant,
        classNames,
        customStyles,
        mapFlat,
      ],
    );

    return (
      <FormContext value={context}>
        <BaseForm
          className={cx(rootVariants({ variant }), className)}
          ref={mergedRef}
          style={{ gap, ...style }}
          onFormSubmit={async (values, eventDetails) => {
            onFormSubmit?.(values, eventDetails);
            if (!onFinish) return;
            setSubmitLoading(true);
            try {
              await onFinish(values, eventDetails);
              snapshotRef.current = serializeForm(formRef.current);
              syncUnsaved();
            } finally {
              setSubmitLoading(false);
            }
          }}
          {...rest}
        >
          {items && items.length > 0 ? (
            itemsType === 'group' ? (
              (items as FormGroupItemType[]).map((item, i) => mapTree(item, i))
            ) : (
              <FormFlatGroup
                className={classNames?.group}
                style={customStyles?.group}
                variant={variant}
              >
                {(items as FormFieldProps[])
                  .filter((item) => !item.hidden)
                  .map((item, i) => mapFlat(item, i))}
              </FormFlatGroup>
            )
          ) : undefined}
          {children}
          {footer}
        </BaseForm>
      </FormContext>
    );
  },
);

Form.displayName = 'Form';

export default Form;
