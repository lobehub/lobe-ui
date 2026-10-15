import { useThemeMode } from 'antd-style';
import { type ReactNode } from 'react';

import DatePicker from '@/base-ui/DatePicker/DayjsDatePicker';
import DateRangePicker from '@/base-ui/DatePicker/DayjsDateRangePicker';
import Input from '@/base-ui/Input/Input';
import InputNumber from '@/base-ui/Input/InputNumber';
import Select from '@/base-ui/Select';
import Switch from '@/base-ui/Switch';

import { styles } from './style';
import type { ProColumnType, ProTableFormInstance, ProTableValueType } from './type';
import { useColumnRequest } from './useColumnRequest';
import { resolveValueEnum, resolveValueType, valueEnumToList } from './utils';

export interface FieldControlProps {
  column: ProColumnType<any>;
  form: ProTableFormInstance;
  /** Light filter bar: small controls, outlined in light mode and filled in dark mode. */
  light?: boolean;
  onChange: (value: any) => void;
  placeholder: { input: string; select: string };
  value: any;
}

const SELECT_TYPES = new Set<ProTableValueType>(['select', 'radio', 'checkbox']);

/** The search-form control of a column (Pro "edit" mode, query flavor). */
const FieldControl = ({ column, form, light, onChange, placeholder, value }: FieldControlProps) => {
  const valueType = resolveValueType(column) ?? 'text';
  const valueEnum = resolveValueEnum(column);
  const { fieldProps = {} } = column;
  const size = light ? 'small' : undefined;
  const { isDarkMode } = useThemeMode();
  // Light filter: outlined on light backgrounds, filled in dark mode.
  const variant = light ? (isDarkMode ? 'filled' : 'outlined') : undefined;
  const remote = useColumnRequest(column);
  // Light filter: the field label always stays visible inside the control (Pro `FieldLabel`
  // style, "Status: All"), so a placeholder such as "All" is never ambiguous.
  const lightLabel =
    light &&
    column.title !== undefined &&
    column.title !== null &&
    typeof column.title !== 'function' ? (
      <span className={styles.lightFilterLabel} data-pro-table-light-label="">
        {column.title as ReactNode}
      </span>
    ) : undefined;
  const labelProps = lightLabel ? { prefix: lightLabel } : {};

  if (column.renderFormItem) {
    return column.renderFormItem(
      column,
      { form, isQuery: !light, onChange, value },
      form,
    ) as ReactNode;
  }

  if (remote.enabled || valueEnum || SELECT_TYPES.has(valueType)) {
    const options =
      remote.options ??
      fieldProps.options ??
      valueEnumToList(valueEnum).map((item) => ({
        disabled: item.disabled,
        label: item.text,
        value: item.value,
      }));
    return (
      <Select
        allowClear
        loading={remote.loading}
        mode={valueType === 'checkbox' ? 'multiple' : undefined}
        options={options as any}
        placeholder={placeholder.select}
        size={size}
        {...labelProps}
        style={{ width: '100%' }}
        value={value ?? (valueType === 'checkbox' ? [] : null)}
        variant={variant}
        {...fieldProps}
        onChange={(next) => onChange(next ?? undefined)}
        onSearch={
          remote.onSearch
            ? (keyWords: string) => {
                remote.onSearch!(keyWords);
                fieldProps.onSearch?.(keyWords);
              }
            : fieldProps.onSearch
        }
      />
    );
  }

  switch (valueType) {
    case 'digit':
    case 'money':
    case 'percent':
    case 'progress': {
      return (
        <InputNumber
          placeholder={placeholder.input}
          size={size}
          {...labelProps}
          style={{ width: '100%' }}
          value={value ?? null}
          variant={variant}
          {...fieldProps}
          onChange={(next) => onChange(next ?? undefined)}
        />
      );
    }
    case 'switch': {
      const control = (
        <Switch checked={!!value} {...fieldProps} onChange={(next) => onChange(next)} />
      );
      return lightLabel ? (
        <span className={styles.lightFilterSwitch}>
          {lightLabel}
          {control}
        </span>
      ) : (
        control
      );
    }
    case 'date':
    case 'dateTime': {
      return (
        <DatePicker
          allowClear
          placeholder={placeholder.select}
          size={size}
          {...labelProps}
          style={{ width: '100%' }}
          value={value ?? null}
          variant={variant}
          {...fieldProps}
          onChange={(next) => onChange(next ?? undefined)}
        />
      );
    }
    case 'dateRange':
    case 'dateTimeRange': {
      return (
        <DateRangePicker
          allowClear
          size={size}
          {...labelProps}
          style={{ width: '100%' }}
          value={value ?? [null, null]}
          variant={variant}
          {...fieldProps}
          onChange={(next) => onChange(next && (next[0] || next[1]) ? next : undefined)}
        />
      );
    }
    default: {
      return (
        <Input
          allowClear
          placeholder={placeholder.input}
          size={size}
          {...labelProps}
          type={valueType === 'password' ? 'password' : undefined}
          value={value ?? ''}
          variant={variant}
          {...fieldProps}
          onChange={(event) => onChange(event.target.value === '' ? undefined : event.target.value)}
          onClear={() => {
            onChange(undefined);
            fieldProps.onClear?.();
          }}
        />
      );
    }
  }
};

export default FieldControl;
