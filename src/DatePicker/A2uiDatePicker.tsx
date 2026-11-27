'use client';

import clsx from 'clsx';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { type ReactNode, useId, useMemo, useState } from 'react';

import { useControlledState } from '@/hooks/useControlledState';
import datePickerMessages from '@/i18n/resources/en/datePicker';
import { useTranslation } from '@/i18n/useTranslation';
import PlaygroundField from '@/internal/a2ui/playgroundField';
import PlaygroundPopover from '@/internal/a2ui/PlaygroundPopover';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { styles } from './a2uiStyle';
import type { GenerateConfig } from './core/generate';
import { datePickerClasses } from './stable';

interface Parts {
  d: number;
  m: number;
  y: number;
}

export interface A2uiDatePickerProps<DateType> {
  className?: string;
  defaultOpen?: boolean;
  defaultValue?: DateType | null;
  disabled?: boolean;
  disabledDate?: (date: DateType) => boolean;
  generateConfig: GenerateConfig<DateType>;
  id?: string;
  label?: ReactNode;
  maxDate?: DateType;
  minDate?: DateType;
  onChange?: (date: DateType | null, dateString: string) => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  placeholder?: string;
  style?: React.CSSProperties;
  value?: DateType | null;
}

const pad = (n: number) => String(n).padStart(2, '0');
const key = ({ y, m, d }: Parts) => y * 10_000 + m * 100 + d;

/**
 * `DatePicker variant="a2ui"`: an outline trigger with a calendar icon and the date as
 * "Thu, Nov 12, 2026", opening a one-month calendar. Adapted from CopilotKit a2ui-playground
 * (MIT), `renderers/inputs.tsx` DatePicker and shadcn `components/ui/calendar.tsx`. Date math goes
 * through the picker's `generateConfig`, so it works for `Date` and `Dayjs` alike.
 */
const A2uiDatePicker = <DateType,>({
  className,
  defaultOpen,
  defaultValue,
  disabled,
  disabledDate,
  generateConfig: g,
  id: idProp,
  label,
  maxDate,
  minDate,
  onChange,
  onOpenChange,
  open: openProp,
  placeholder,
  style,
  value: valueProp,
}: A2uiDatePickerProps<DateType>) => {
  const autoId = useId();
  const id = idProp ?? autoId;
  const { locale: contextLocale, t } = useTranslation(datePickerMessages);
  const locale = contextLocale || 'en-US';
  const [value, setValue] = useControlledState<DateType | null>(null, {
    defaultValue,
    value: valueProp,
  });
  const [open, setOpen] = useControlledState(false, {
    defaultValue: defaultOpen,
    onChange: onOpenChange,
    value: openProp,
  });

  const parts = (date: DateType): Parts => ({
    d: g.getDate(date),
    m: g.getMonth(date),
    y: g.getYear(date),
  });
  const make = ({ d, m, y }: Parts) =>
    g.setDate(g.setMonth(g.setYear(g.setDate(g.getNow(), 1), y), m), d);
  const valid = value != null && g.isValidate(value) ? value : null;
  const selected = valid ? parts(valid) : null;
  const today = parts(g.getNow());

  const [view, setView] = useState<{ m: number; y: number }>(() =>
    selected ? { m: selected.m, y: selected.y } : { m: today.m, y: today.y },
  );

  const format = useMemo(
    () => ({
      caption: new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }),
      trigger: new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'short',
        weekday: 'short',
        year: 'numeric',
      }),
      weekday: new Intl.DateTimeFormat(locale, { weekday: 'short' }),
    }),
    [locale],
  );
  const toNative = ({ d, m, y }: Parts) => new Date(y, m, d);
  const weekdays = Array.from({ length: 7 }, (_, index) => {
    const name = format.weekday.format(new Date(2026, 10, 1 + index)); // 2026-11-01 is a Sunday
    return locale.startsWith('en') ? name.slice(0, 2) : name;
  });

  const handleOpenChange = (next: boolean) => {
    if (next && selected) setView({ m: selected.m, y: selected.y });
    setOpen(next);
  };

  // The month grid: leading days of the previous month, the month, trailing days to a full week.
  const first = make({ d: 1, m: view.m, y: view.y });
  const lead = g.getWeekDay(first);
  const daysInMonth = g.getDate(g.getEndDate(first));
  const total = Math.ceil((lead + daysInMonth) / 7) * 7;
  const cells = Array.from({ length: total }, (_, index) => g.addDate(first, index - lead));
  const weeks = Array.from({ length: total / 7 }, (_, row) => cells.slice(row * 7, row * 7 + 7));

  const minKey = minDate ? key(parts(minDate)) : undefined;
  const maxKey = maxDate ? key(parts(maxDate)) : undefined;
  const isDisabled = (date: DateType) => {
    const k = key(parts(date));
    return (
      (minKey !== undefined && k < minKey) ||
      (maxKey !== undefined && k > maxKey) ||
      !!disabledDate?.(date)
    );
  };

  const pick = (date: DateType) => {
    const p = parts(date);
    setValue(date);
    onChange?.(date, `${p.y}-${pad(p.m + 1)}-${pad(p.d)}`);
    setOpen(false);
  };

  const shift = (diff: number) => {
    const next = g.addMonth(first, diff);
    setView({ m: g.getMonth(next), y: g.getYear(next) });
  };

  const trigger = (
    <button
      aria-haspopup="dialog"
      disabled={disabled}
      id={id}
      type="button"
      {...styleProps(styles.trigger, datePickerClasses('input'))}
    >
      <CalendarDays aria-hidden size={14} {...styleProps(styles.triggerIcon)} />
      <span {...styleProps([styles.truncate, !selected && styles.triggerPlaceholder])}>
        {selected
          ? format.trigger.format(toNative(selected))
          : (placeholder ?? t('datePicker.placeholder'))}
      </span>
    </button>
  );

  return (
    <div
      {...toDataAttributes({ variant: 'a2ui' })}
      {...styleProps(undefined, clsx(datePickerClasses(), className), style)}
    >
      <PlaygroundField htmlFor={id} label={label}>
        <PlaygroundPopover
          className={datePickerClasses('popup')}
          open={open}
          trigger={trigger}
          onOpenChange={handleOpenChange}
        >
          <div {...styleProps(styles.calendar, datePickerClasses('container'))}>
            <div {...styleProps(styles.header, datePickerClasses('header'))}>
              <div {...styleProps(styles.caption)}>
                <span aria-live="polite" {...styleProps(styles.captionLabel)}>
                  {format.caption.format(new Date(view.y, view.m, 1))}
                </span>
              </div>
              <div {...styleProps(styles.nav)}>
                <button
                  aria-label={t('datePicker.previousMonth')}
                  type="button"
                  {...styleProps(styles.navButton)}
                  onClick={() => shift(-1)}
                >
                  <ChevronLeft aria-hidden size={16} />
                </button>
                <button
                  aria-label={t('datePicker.nextMonth')}
                  type="button"
                  {...styleProps(styles.navButton)}
                  onClick={() => shift(1)}
                >
                  <ChevronRight aria-hidden size={16} />
                </button>
              </div>
            </div>
            <div role="grid" {...styleProps(styles.grid, datePickerClasses('body'))}>
              <div role="row" {...styleProps(styles.weekdays)}>
                {weekdays.map((name, index) => (
                  <span key={index} role="columnheader" {...styleProps(styles.weekday)}>
                    {name}
                  </span>
                ))}
              </div>
              {weeks.map((week, row) => (
                <div key={row} role="row" {...styleProps(styles.week)}>
                  {week.map((date) => {
                    const p = parts(date);
                    const isSelected = !!selected && key(p) === key(selected);
                    const isToday = key(p) === key(today);
                    const outside = p.m !== view.m;
                    const off = isDisabled(date);
                    return (
                      <div
                        key={key(p)}
                        role="gridcell"
                        {...styleProps(
                          [styles.day, isToday && !isSelected && styles.dayToday],
                          datePickerClasses('item'),
                        )}
                      >
                        <button
                          aria-current={isToday ? 'date' : undefined}
                          aria-label={format.trigger.format(toNative(p))}
                          aria-pressed={isSelected}
                          data-outside={outside || undefined}
                          data-selected={isSelected || undefined}
                          data-today={isToday || undefined}
                          disabled={off}
                          type="button"
                          {...styleProps([
                            styles.dayButton,
                            outside && styles.dayOutside,
                            isSelected && styles.daySelected,
                            off && styles.dayDisabled,
                          ])}
                          onClick={() => pick(date)}
                        >
                          {p.d}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </PlaygroundPopover>
      </PlaygroundField>
    </div>
  );
};

export default A2uiDatePicker;
