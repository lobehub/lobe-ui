'use client';

import { cx, useResponsive } from 'antd-style';
import { type FormEvent, useCallback, useMemo, useRef } from 'react';

import FormFlatGroup from '../Form/components/FormFlatGroup';
import FormGroup from '../Form/components/FormGroup';
import { rootVariants } from '../Form/style';
import { FormKitContext, type FormKitContextValue } from './context';
import FormField from './Field';
import type { FormFieldProps, FormGroupItem, FormProps, FormValues } from './type';

const focusFirstInvalid = (root: HTMLFormElement | null) => {
  const target = root?.querySelector<HTMLElement>('[aria-invalid="true"]');
  if (!target) return;
  target.scrollIntoView?.({ block: 'center' });
  target.focus();
};

const Form = <T extends FormValues>({
  activeKey,
  children,
  className,
  classNames,
  collapsible,
  defaultActiveKey,
  footer,
  form,
  gap,
  itemMinWidth,
  items,
  itemsType = 'group',
  layout,
  onCollapse,
  ref,
  style,
  styles: customStyles,
  variant = 'borderless',
  ...rest
}: FormProps<T>) => {
  const { mobile } = useResponsive();
  const formRef = useRef<HTMLFormElement | null>(null);

  const context = useMemo<FormKitContextValue>(
    () => ({
      form,
      itemMinWidth,
      layout: layout || (mobile ? 'vertical' : 'horizontal'),
      variant,
    }),
    [form, itemMinWidth, layout, mobile, variant],
  );

  const mergedRef = useCallback(
    (node: HTMLFormElement | null) => {
      formRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const result = await form.submit();
      if (!result.valid) setTimeout(() => focusFirstInvalid(formRef.current), 0);
    },
    [form],
  );

  const renderField = (item: FormFieldProps<T>, index: number) => (
    <FormField
      className={classNames?.item}
      divider={index !== 0}
      key={item.name ?? index}
      style={customStyles?.item}
      {...(item as FormFieldProps)}
    />
  );

  const renderGroup = (group: FormGroupItem<T>, index: number) => {
    const key = group.key ?? index;
    return (
      <FormGroup
        active={activeKey && group.key ? activeKey.includes(key) : undefined}
        className={classNames?.group}
        collapsible={group.collapsible ?? collapsible}
        desc={group.desc}
        extra={group.extra}
        icon={group.icon}
        key={key}
        style={customStyles?.group}
        title={group.title}
        variant={group.variant || variant}
        defaultActive={
          defaultActiveKey && group.key ? defaultActiveKey.includes(key) : group.defaultActive
        }
        onCollapse={(active) => {
          const keys = (activeKey || defaultActiveKey || []).filter((k) => k !== key);
          onCollapse?.(active ? [...keys, key] : keys);
        }}
      >
        {Array.isArray(group.children)
          ? group.children.filter((item) => !item.hidden).map(renderField)
          : group.children}
      </FormGroup>
    );
  };

  const renderedItems =
    items && items.length > 0 ? (
      itemsType === 'group' ? (
        (items as FormGroupItem<T>[]).map(renderGroup)
      ) : (
        <FormFlatGroup className={classNames?.group} style={customStyles?.group} variant={variant}>
          {(items as FormFieldProps<T>[]).filter((item) => !item.hidden).map(renderField)}
        </FormFlatGroup>
      )
    ) : null;

  return (
    <FormKitContext value={context}>
      <form
        {...rest}
        noValidate
        className={cx(rootVariants({ variant }), className)}
        ref={mergedRef}
        style={{ gap, ...style }}
        onSubmit={handleSubmit}
      >
        {renderedItems}
        {children}
        {footer}
      </form>
    </FormKitContext>
  );
};

Form.displayName = 'Form';

export default Form;
