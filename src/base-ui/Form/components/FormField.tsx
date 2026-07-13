'use client';

import { Field } from '@base-ui/react/field';
import { cx, useResponsive } from 'antd-style';
import { cloneElement, isValidElement, memo, useMemo } from 'react';

import { useFormContext } from '../context';
import { fieldStyles, fieldVariants } from '../style';
import type { FormFieldProps } from '../type';
import FormDivider from './FormDivider';
import FormTitle from './FormTitle';

const FormField = memo<FormFieldProps>(
  ({
    avatar,
    children,
    className,
    desc,
    divider,
    hidden,
    label,
    layout,
    minWidth,
    name,
    required,
    style,
    tag,
    variant,
    ...rest
  }) => {
    const { mobile } = useResponsive();
    const config = useFormContext();

    const mergedLayout = layout || (mobile ? 'vertical' : config.layout);
    const mergedVariant = variant || config.variant;
    const mergedMinWidth = minWidth ?? config.itemMinWidth;

    const control = useMemo(() => {
      if (!isValidElement(children)) return children;
      const props = children.props as Record<string, unknown>;
      const injected: Record<string, unknown> = {};
      if (required && props.required === undefined) injected.required = true;
      if (name) {
        const initialValue = config.initialValues?.[name];
        if (
          initialValue !== undefined &&
          props.value === undefined &&
          props.defaultValue === undefined
        )
          injected.defaultValue = initialValue;
      }
      if (Object.keys(injected).length === 0) return children;
      return cloneElement(children, injected as never);
    }, [children, name, required, config.initialValues]);

    if (hidden) return null;

    return (
      <>
        {divider && <FormDivider visible={mergedVariant !== 'borderless'} />}
        <Field.Root
          className={cx(fieldVariants({ layout: mergedLayout }), className)}
          name={name}
          style={style}
          {...rest}
        >
          <Field.Label className={fieldStyles.label}>
            <FormTitle avatar={avatar} desc={desc} tag={tag} title={label} />
          </Field.Label>
          <div
            className={cx(
              fieldStyles.control,
              mergedLayout === 'vertical' && fieldStyles.controlVertical,
            )}
            style={
              mergedMinWidth === undefined || mergedMinWidth === null || mergedMinWidth === ''
                ? undefined
                : {
                    minWidth:
                      typeof mergedMinWidth === 'number' ? `${mergedMinWidth}px` : mergedMinWidth,
                  }
            }
          >
            {control}
            <Field.Error className={fieldStyles.error} />
          </div>
        </Field.Root>
      </>
    );
  },
);

FormField.displayName = 'FormField';

export default FormField;
