'use client';

import dayjs from 'dayjs';
import { CalendarIcon } from 'lucide-react';
import { memo, useState } from 'react';
import useControlledState from 'use-merge-value';

import datePickerMessages from '@/i18n/resources/en/datePicker';
import { useTranslation } from '@/i18n/useTranslation';
import Icon from '@/Icon';

import { clampToBounds, DEFAULT_FORMAT } from './calendar';
import CalendarPanel from './CalendarPanel';
import PickerShell from './PickerShell';
import { styles } from './style';
import type { DatePickerProps } from './type';

const PLACEHOLDER_KEY = {
  date: 'datePicker.placeholder',
  month: 'datePicker.monthPlaceholder',
  year: 'datePicker.yearPlaceholder',
} as const;

export const formatDate = (date: Date, format: DatePickerProps['format'], fallback: string) =>
  typeof format === 'function' ? format(date) : dayjs(date).format(format ?? fallback);

const DatePicker = memo<DatePickerProps>(
  ({
    allowClear = true,
    className,
    defaultValue = null,
    disabled,
    disabledDate,
    footer,
    format,
    max,
    min,
    mode = 'date',
    onChange,
    placeholder,
    shadow,
    size,
    style,
    value,
    variant,
  }) => {
    const { t } = useTranslation(datePickerMessages);
    const [current, setCurrent] = useControlledState<Date | null>(defaultValue, {
      defaultValue,
      onChange,
      value,
    });
    const [open, setOpen] = useState(false);
    const [month, setMonth] = useState<Date>(() => current ?? new Date());

    const text = current ? formatDate(current, format, DEFAULT_FORMAT[mode]) : null;

    return (
      <PickerShell
        className={className}
        disabled={disabled}
        open={open}
        shadow={shadow}
        showClear={allowClear && !!current}
        size={size}
        style={style}
        variant={variant}
        icon={
          <span className={styles.icon}>
            <Icon icon={CalendarIcon} size={14} />
          </span>
        }
        trigger={
          <button className={styles.trigger} disabled={disabled} type="button">
            {text ?? (
              <span className={styles.placeholder}>{placeholder ?? t(PLACEHOLDER_KEY[mode])}</span>
            )}
          </button>
        }
        onClear={() => setCurrent(null)}
        onOpenChange={(next) => {
          if (next) setMonth(current ?? clampToBounds(new Date(), { max, min }));
          setOpen(next);
        }}
      >
        <CalendarPanel
          bounds={{ disabledDate, max, min }}
          mode={mode}
          month={month}
          selected={current}
          onMonthChange={setMonth}
          onSelect={(date) => {
            setCurrent(date);
            setOpen(false);
          }}
        />
        {footer && <div className={styles.footer}>{footer}</div>}
      </PickerShell>
    );
  },
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;
