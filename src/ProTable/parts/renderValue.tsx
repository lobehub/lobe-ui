import cx from 'clsx';
import { Copy } from 'lucide-react';
import { type ReactNode } from 'react';

import ActionIcon from '@/ActionIcon';
import Progress from '@/Progress';

import { styles } from '../style';
import type { ProTableStatus, ProTableValueEnum, ProTableValueType } from '../type';
import { findValueEnum, formatDate, isEmptyValue, isNil, toDate } from '../utils';

const STATUS_COLOR: Record<ProTableStatus, string> = {
  Default: 'var(--lobe-pro-table-status-default)',
  Error: 'var(--lobe-pro-table-status-error)',
  Processing: 'var(--lobe-pro-table-status-processing)',
  Success: 'var(--lobe-pro-table-status-success)',
  Warning: 'var(--lobe-pro-table-status-warning)',
};

export const StatusText = ({
  color,
  status,
  text,
}: {
  color?: string;
  status?: ProTableStatus;
  text: ReactNode;
}) => {
  if (!status && !color) return <>{text}</>;
  return (
    <span className={styles.status}>
      <span
        className={cx(styles.statusDot, status === 'Processing' && styles.statusProcessing)}
        data-status={status}
        style={{ background: color ?? STATUS_COLOR[status ?? 'Default'] }}
      />
      {text}
    </span>
  );
};

const renderEnum = (valueEnum: ProTableValueEnum, value: unknown): ReactNode => {
  if (Array.isArray(value)) {
    return (
      <span className={styles.enumList}>
        {value.map((item) => (
          <span key={String(item)}>{renderEnum(valueEnum, item)}</span>
        ))}
      </span>
    );
  }
  const item = findValueEnum(valueEnum, value);
  if (!item) return String(value);
  return <StatusText color={item.color} status={item.status} text={item.text} />;
};

export interface RenderValueOptions {
  copyText?: string;
  emptyText: ReactNode;
  fieldProps?: Record<string, any>;
  rowIndex: number;
  valueEnum?: ProTableValueEnum;
  valueType?: ProTableValueType;
}

const formatNumber = (value: number, precision?: number) =>
  value.toLocaleString('en-US', {
    maximumFractionDigits: precision ?? 20,
    minimumFractionDigits: precision ?? 0,
  });

export const renderValue = (value: any, options: RenderValueOptions): ReactNode => {
  const { emptyText, fieldProps = {}, rowIndex, valueEnum, valueType } = options;

  if (valueType === 'index') return rowIndex + 1;
  if (valueType === 'indexBorder')
    return (
      <span className={styles.indexBorder} data-top={rowIndex < 3 ? '' : undefined}>
        {rowIndex + 1}
      </span>
    );
  if (valueType === 'option') return value;

  if (isEmptyValue(value)) return emptyText;
  if (valueEnum) return renderEnum(valueEnum, value);

  switch (valueType) {
    case 'password': {
      return '********';
    }
    case 'digit': {
      return typeof value === 'number' ? formatNumber(value, fieldProps.precision) : value;
    }
    case 'money': {
      const symbol = fieldProps.customSymbol ?? '¥';
      const number = Number(value);
      if (Number.isNaN(number)) return value;
      return `${number < 0 ? '-' : ''}${symbol}${formatNumber(Math.abs(number), fieldProps.precision ?? 2)}`;
    }
    case 'percent': {
      const number = Number(value);
      if (Number.isNaN(number)) return value;
      return `${formatNumber(number, fieldProps.precision)}%`;
    }
    case 'progress': {
      const number = Number(value);
      return (
        <Progress
          percent={Number.isNaN(number) ? 0 : number}
          size="small"
          style={{ minWidth: 100 }}
        />
      );
    }
    case 'switch': {
      return value ? (fieldProps.checkedChildren ?? 'On') : (fieldProps.unCheckedChildren ?? 'Off');
    }
    case 'date':
    case 'dateTime':
    case 'time': {
      const date = toDate(value);
      if (!date) return String(value);
      return formatDate(date, valueType === 'dateTime', valueType === 'time');
    }
    case 'dateRange':
    case 'dateTimeRange': {
      if (!Array.isArray(value)) return String(value);
      return value
        .map((item) => {
          const date = toDate(item);
          return date ? formatDate(date, valueType === 'dateTimeRange') : '';
        })
        .join(' ~ ');
    }
    case 'code': {
      return <code className={styles.code}>{String(value)}</code>;
    }
    default: {
      return isNil(value) || typeof value === 'object' ? value : String(value);
    }
  }
};

export const CopyableText = ({
  children,
  label,
  text,
}: {
  children: ReactNode;
  label: string;
  text: string;
}) => (
  <span className={styles.copyable}>
    <span className={styles.copyableText}>{children}</span>
    <ActionIcon
      icon={Copy}
      size="small"
      title={label}
      onClick={(event) => {
        event.stopPropagation();
        void navigator.clipboard?.writeText(text);
      }}
    />
  </span>
);
