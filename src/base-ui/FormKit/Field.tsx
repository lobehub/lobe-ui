'use client';

import { cx, useResponsive } from 'antd-style';
import {
  cloneElement,
  isValidElement,
  memo,
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
} from 'react';

import formMessages from '@/i18n/resources/en/form';
import { useTranslation } from '@/i18n/useTranslation';

import FormDivider from '../Form/components/FormDivider';
import FormTitle from '../Form/components/FormTitle';
import { fieldStyles, fieldVariants } from '../Form/style';
import { resolveBinding } from './binding';
import { useFormKitContext } from './context';
import type { FieldValidator } from './engine/types';
import { getInternals } from './instance';
import { toFieldValidator } from './schema';
import { fieldKitStyles } from './style';
import type { FieldRenderProps, FormFieldProps, FormValues } from './type';
import { useStoreSelector } from './useStoreSelector';

const isEmpty = (value: unknown) =>
  value === undefined ||
  value === null ||
  value === '' ||
  (Array.isArray(value) && value.length === 0);

type ControlProps = Pick<
  FormFieldProps,
  | 'bare'
  | 'children'
  | 'deps'
  | 'getValue'
  | 'name'
  | 'render'
  | 'required'
  | 'trigger'
  | 'validate'
  | 'validateDebounce'
  | 'validateOn'
  | 'valueProp'
> & { id: string; name: string };

const FieldControl = memo<ControlProps>(
  ({
    bare,
    children,
    deps,
    getValue,
    id,
    name,
    render,
    required,
    trigger,
    validate,
    validateDebounce,
    validateOn,
    valueProp,
  }) => {
    const { form } = useFormKitContext();
    const { engine, validateOn: formValidateOn } = getInternals(form);
    const { t } = useTranslation(formMessages);
    const errorId = `${id}-error`;

    const requiredMessage = typeof required === 'string' ? required : t('form.required');
    const fieldValidator = validate ? toFieldValidator(validate) : undefined;
    const validatorRef = useRef<FieldValidator | undefined>(undefined);
    validatorRef.current = async (value, values) => {
      if (required && isEmpty(value)) return requiredMessage;
      return fieldValidator?.(value, values);
    };
    const hasValidator = Boolean(required || validate);
    const depsKey = deps?.join('\u0000');

    useEffect(
      () =>
        engine.registerField(name, {
          debounceMs: validateDebounce,
          deps: depsKey ? depsKey.split('\u0000') : undefined,
          validate: hasValidator
            ? (value, values) => validatorRef.current!(value, values)
            : undefined,
          validateOn: validateOn ?? formValidateOn,
        }),
      [engine, name, hasValidator, depsKey, validateDebounce, validateOn, formValidateOn],
    );

    const field = useStoreSelector(engine, (e) => e.getField(name));

    const child = isValidElement(children) ? (children as ReactElement<any>) : undefined;
    const binding = child ? resolveBinding(child, { getValue, trigger, valueProp }) : undefined;
    const handlerRef = useRef({ binding, childProps: child?.props as Record<string, any> });
    handlerRef.current = { binding, childProps: child?.props as Record<string, any> };

    const onChange = useCallback(
      (...args: unknown[]) => {
        const { binding: current, childProps } = handlerRef.current;
        if (current) childProps?.[current.trigger]?.(...args);
        const next = current ? current.getValue(...args) : args[0];
        engine.setValue(name, next, 'user');
      },
      [engine, name],
    );
    const onBlur = useCallback(
      (...args: unknown[]) => {
        handlerRef.current.childProps?.onBlur?.(...args);
        engine.blurField(name);
      },
      [engine, name],
    );

    const warnedRef = useRef(false);
    useEffect(() => {
      if (render || child || warnedRef.current || process.env.NODE_ENV === 'production') return;
      warnedRef.current = true;
      console.warn(
        `[@lobehub/ui/base-ui/form] Form.Field "${name}" needs a single element child or a render prop; nothing was bound.`,
      );
    }, [render, child, name]);

    const errorNode =
      field.error && !bare ? (
        <div className={fieldStyles.error} id={errorId}>
          {field.error}
        </div>
      ) : null;

    if (render) {
      const renderProps: FieldRenderProps = {
        error: field.error,
        name,
        onBlur,
        onChange,
        touched: field.touched,
        validating: field.validating,
        value: field.value,
      };
      return (
        <>
          {render(renderProps)}
          {errorNode}
        </>
      );
    }

    if (!child || !binding) return <>{children}</>;

    const control = cloneElement(child, {
      'aria-describedby': field.error ? errorId : undefined,
      'aria-invalid': field.error ? true : undefined,
      'id': child.props.id ?? id,
      [binding.trigger]: onChange,
      [binding.valueProp]: field.value,
      'onBlur': onBlur,
    });

    return (
      <>
        {control}
        {errorNode}
      </>
    );
  },
);

FieldControl.displayName = 'FormFieldControl';

const FormField = memo<FormFieldProps>(
  ({
    avatar,
    bare,
    children,
    className,
    deps,
    desc,
    divider,
    extra,
    getValue,
    hidden,
    label,
    layout,
    minWidth,
    name,
    render,
    required,
    style,
    tag,
    trigger,
    validate,
    validateDebounce,
    validateOn,
    valueProp,
    variant,
  }) => {
    const id = useId();
    const { mobile } = useResponsive();
    const config = useFormKitContext();

    if (hidden) return null;

    const control = !name ? (
      children
    ) : (
      <FieldControl
        bare={bare}
        deps={deps}
        getValue={getValue}
        id={id}
        name={name}
        render={render}
        required={required}
        trigger={trigger}
        validate={validate}
        validateDebounce={validateDebounce}
        validateOn={validateOn}
        valueProp={valueProp}
      >
        {children}
      </FieldControl>
    );

    if (bare) return <>{control}</>;

    const labelFor = render
      ? undefined
      : name
        ? id
        : isValidElement<{ id?: string }>(children)
          ? children.props.id
          : undefined;
    const mergedLayout = layout || (mobile ? 'vertical' : config.layout);
    const mergedVariant = variant || config.variant;
    const mergedMinWidth = minWidth ?? config.itemMinWidth;
    const controlWidth =
      mergedLayout === 'vertical' || mergedMinWidth === undefined || mergedMinWidth === ''
        ? undefined
        : typeof mergedMinWidth === 'number'
          ? `${mergedMinWidth}px`
          : mergedMinWidth;

    return (
      <>
        {divider && <FormDivider visible={mergedVariant !== 'borderless'} />}
        <div className={cx(fieldVariants({ layout: mergedLayout }), className)} style={style}>
          <label className={fieldStyles.label} htmlFor={labelFor}>
            <FormTitle
              avatar={avatar}
              desc={desc}
              tag={tag}
              title={
                required ? (
                  <>
                    {label}
                    <span aria-hidden className={fieldKitStyles.required}>
                      *
                    </span>
                  </>
                ) : (
                  label
                )
              }
            />
          </label>
          <div
            style={controlWidth ? { width: controlWidth } : undefined}
            className={cx(
              fieldStyles.control,
              mergedLayout === 'vertical' && fieldStyles.controlVertical,
              controlWidth && fieldKitStyles.controlFixed,
            )}
          >
            {control}
            {extra && <div className={fieldKitStyles.extra}>{extra}</div>}
          </div>
        </div>
      </>
    );
  },
);

FormField.displayName = 'FormField';

export default FormField as unknown as (<T extends FormValues = FormValues>(
  props: FormFieldProps<T>,
) => ReactNode) & { displayName?: string };
