'use client';

import clsx from 'clsx';
import { type FormEvent, Fragment, useCallback, useMemo, useRef } from 'react';

import { a2uiFieldStyles } from '@/internal/a2ui/standardField';
import { a2uiStyles } from '@/internal/a2ui/styles';
import { styleProps } from '@/styles/stylex/props';
import { useResponsive } from '@/styles/theme/scope';
import { toDataAttributes } from '@/utils/bem';

import FormFlatGroup from '../Form/components/FormFlatGroup';
import FormGroup from '../Form/components/FormGroup';
import { formMarker } from '../Form/marker.stylex';
import { FormClassesContext } from '../Form/stableContext';
import { rootStyles } from '../Form/style';
import { styles as a2uiFormStyles } from './a2uiStyle';
import { FormKitContext, type FormKitContextValue } from './context';
import FormField from './Field';
import { formKitClasses } from './stable';
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
      layout: layout || (mobile ? 'vertical' : 'horizontal'),
      variant,
    }),
    [form, layout, mobile, variant],
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
      minWidth={'minWidth' in item ? item.minWidth : itemMinWidth}
    />
  );

  const isA2ui = variant === 'a2ui';
  const groupVariant = isA2ui ? 'borderless' : variant;

  const renderGroup = (group: FormGroupItem<T>, index: number) => {
    const key = group.key ?? index;
    // The A2UI form has no group chrome: a group is its fields in the column.
    if (isA2ui)
      return Array.isArray(group.children) ? (
        group.children.filter((item) => !item.hidden).map(renderField)
      ) : (
        <Fragment key={key}>{group.children}</Fragment>
      );
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
        variant={group.variant || groupVariant}
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
      ) : isA2ui ? (
        (items as FormFieldProps<T>[]).filter((item) => !item.hidden).map(renderField)
      ) : (
        <FormFlatGroup
          className={classNames?.group}
          style={customStyles?.group}
          variant={groupVariant}
        >
          {(items as FormFieldProps<T>[]).filter((item) => !item.hidden).map(renderField)}
        </FormFlatGroup>
      )
    ) : null;

  return (
    <FormKitContext value={context}>
      <form
        {...toDataAttributes({ layout, variant })}
        {...rest}
        noValidate
        ref={mergedRef}
        {...styleProps(
          isA2ui
            ? [formMarker, a2uiStyles.base, a2uiFieldStyles.base, a2uiFormStyles.root]
            : [formMarker, rootStyles.root, variant === 'borderless' && rootStyles.borderless],
          clsx(formKitClasses(), className),
          isA2ui
            ? { gap, ...style }
            : { gap: gap ?? (layout === 'vertical' ? 0 : undefined), ...style },
        )}
        onSubmit={handleSubmit}
      >
        <FormClassesContext value={formKitClasses}>
          {renderedItems}
          {children}
          {footer}
        </FormClassesContext>
      </form>
    </FormKitContext>
  );
};

Form.displayName = 'Form';

export default Form;
