'use client';

import dayjs from 'dayjs';
import { ArrowRight, CalendarIcon } from 'lucide-react';
import { memo, useState } from 'react';
import useControlledState from 'use-merge-value';

import datePickerMessages from '@/i18n/resources/en/datePicker';
import { useTranslation } from '@/i18n/useTranslation';
import Icon from '@/Icon';

import { DEFAULT_FORMAT, orderRange } from './calendar';
import CalendarPanel from './CalendarPanel';
import { formatDate } from './DatePicker';
import PickerShell from './PickerShell';
import { styles } from './style';
import type { DateRangePickerProps, DateRangeValue } from './type';

const EMPTY: DateRangeValue = [null, null];

const DateRangePicker = memo<DateRangePickerProps>(
  ({
    allowClear = true,
    className,
    defaultValue = EMPTY,
    disabled,
    disabledDate,
    format,
    max,
    min,
    onChange,
    placeholder,
    shadow,
    size,
    style,
    value,
    variant,
  }) => {
    const { t } = useTranslation(datePickerMessages);
    const [current, setCurrent] = useControlledState<DateRangeValue>(defaultValue, {
      defaultValue,
      onChange,
      value,
    });
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState<DateRangeValue>(EMPTY);
    const [hovered, setHovered] = useState<Date | null>(null);
    const [month, setMonth] = useState<Date>(() => current[0] ?? new Date());

    const shown = open && draft[0] ? draft : current;
    const nextMonth = dayjs(month).add(1, 'month').toDate();
    const bounds = { disabledDate, max, min };

    const half = (date: Date | null, fallback: string, active: boolean) => (
      <span className={styles.rangeHalf} data-active={active ? '' : undefined}>
        {date ? (
          formatDate(date, format, DEFAULT_FORMAT.date)
        ) : (
          <span className={styles.placeholder}>{fallback}</span>
        )}
      </span>
    );

    const select = (date: Date) => {
      if (!draft[0] || draft[1]) {
        setDraft([date, null]);
        return;
      }
      const ordered = orderRange(draft[0], date);
      setDraft(EMPTY);
      setCurrent(ordered);
      setOpen(false);
    };

    return (
      <PickerShell
        className={className}
        disabled={disabled}
        open={open}
        shadow={shadow}
        showClear={allowClear && !!(current[0] || current[1])}
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
            <span className={styles.rangeTrigger}>
              {half(
                shown[0],
                placeholder?.[0] ?? t('datePicker.startPlaceholder'),
                open && !draft[0],
              )}
              <span className={styles.icon}>
                <Icon icon={ArrowRight} size={14} />
              </span>
              {half(
                shown[1],
                placeholder?.[1] ?? t('datePicker.endPlaceholder'),
                open && !!draft[0],
              )}
            </span>
          </button>
        }
        onClear={() => setCurrent(EMPTY)}
        onOpenChange={(next) => {
          if (next) {
            setMonth(current[0] ?? new Date());
            setDraft(EMPTY);
          }
          setOpen(next);
        }}
      >
        <div className={styles.range}>
          <CalendarPanel
            bounds={bounds}
            hovered={hovered}
            mode="date"
            month={month}
            range={draft[0] ? draft : current}
            showNav={false}
            onHover={setHovered}
            onMonthChange={setMonth}
            onSelect={select}
          />
          <CalendarPanel
            bounds={bounds}
            hovered={hovered}
            mode="date"
            month={nextMonth}
            range={draft[0] ? draft : current}
            onHover={setHovered}
            onMonthChange={(next) => setMonth(dayjs(next).subtract(1, 'month').toDate())}
            onSelect={select}
          />
        </div>
      </PickerShell>
    );
  },
);

DateRangePicker.displayName = 'DateRangePicker';

export default DateRangePicker;
