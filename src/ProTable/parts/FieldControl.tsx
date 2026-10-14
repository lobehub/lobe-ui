import dayjs, { type Dayjs } from 'dayjs';
import { type ReactNode } from 'react';

import DatePicker from '@/DatePicker/DayjsDatePicker';
import DateRangePicker from '@/DatePicker/DayjsDateRangePicker';
import Input from '@/Input/Input';
import InputNumber from '@/Input/InputNumber';
import Select from '@/Select';
import { useThemeMode } from '@/styles/theme/scope';
import Switch from '@/Switch';

import { useColumnRequest } from '../hooks/useColumnRequest';
import type { ProColumnType, ProTableFormInstance, ProTableValueType } from '../type';
import { resolveValueEnum, resolveValueType, valueEnumToList } from '../utils';

export interface FieldControlProps {
  column: ProColumnType<any>;
  form: ProTableFormInstance;
  light?: boolean;
  onChange: (value: any) => void;
  placeholder: { input: string; select: string };
  value: any;
}

const SELECT_TYPES = new Set<ProTableValueType>(['select', 'radio', 'checkbox']);

// Form values stay native Date (ProTable's contract); the picker works in Dayjs.
const toDayjs = (value: unknown) => (value ? dayjs(value as Date) : null);
const toDate = (value: Dayjs | null | undefined) => value?.toDate() ?? null;

const FieldControl = ({ column, form, light, onChange, placeholder, value }: FieldControlProps) => {
  const valueType = resolveValueType(column) ?? 'text';
  const valueEnum = resolveValueEnum(column);
  const { fieldProps = {} } = column;
  const label = typeof column.title === 'string' ? column.title : undefined;
  const size = light ? 'small' : undefined;
  const { isDarkMode } = useThemeMode();
  // Light filter: outlined on light backgrounds, filled in dark mode.
  const variant = light ? (isDarkMode ? 'filled' : 'outlined') : undefined;
  const remote = useColumnRequest(column);

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
        placeholder={light ? label : placeholder.select}
        size={size}
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
          placeholder={light ? label : placeholder.input}
          size={size}
          style={{ width: '100%' }}
          value={value ?? null}
          variant={variant}
          {...fieldProps}
          onChange={(next) => onChange(next ?? undefined)}
        />
      );
    }
    case 'switch': {
      return <Switch checked={!!value} {...fieldProps} onChange={(next) => onChange(next)} />;
    }
    case 'date':
    case 'dateTime': {
      return (
        <DatePicker
          allowClear
          placeholder={light ? label : placeholder.select}
          size={size}
          style={{ width: '100%' }}
          value={toDayjs(value)}
          variant={variant}
          {...fieldProps}
          onChange={(next) => onChange(toDate(next) ?? undefined)}
        />
      );
    }
    case 'dateRange':
    case 'dateTimeRange': {
      return (
        <DateRangePicker
          allowClear
          size={size}
          style={{ width: '100%' }}
          value={value ? [toDayjs(value[0]), toDayjs(value[1])] : null}
          variant={variant}
          {...fieldProps}
          onChange={(next) =>
            onChange(next && (next[0] || next[1]) ? [toDate(next[0]), toDate(next[1])] : undefined)
          }
        />
      );
    }
    default: {
      return (
        <Input
          allowClear
          placeholder={light ? label : placeholder.input}
          size={size}
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
