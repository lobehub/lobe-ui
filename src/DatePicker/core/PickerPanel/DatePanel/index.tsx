import { clsx } from 'clsx';
import * as React from 'react';

import type { PanelMode, SharedPanelProps } from '../../interface';
import {
  formatValue,
  getWeekStartDate,
  isSameDate,
  isSameMonth,
  WEEK_DAY_COUNT,
} from '../../utils/dateUtil';
import { PanelContext, useInfo } from '../context';
import PanelBody from '../PanelBody';
import PanelHeader from '../PanelHeader';

export interface DatePanelProps<DateType extends object> extends SharedPanelProps<DateType> {
  cellSelection?: boolean;
  /** Used for `WeekPanel` */
  mode?: PanelMode;

  panelName?: PanelMode;
  rowClassName?: (date: DateType) => string;
}

export default function DatePanel<DateType extends object = any>(props: DatePanelProps<DateType>) {
  const {
    prefixCls,
    panelName = 'date',
    locale,
    generateConfig,
    pickerValue,
    onPickerValueChange,
    onModeChange,
    mode = 'date',
    disabledDate,
    onSelect,
    onHover,
    showWeek,
  } = props;

  const panelPrefixCls = `${prefixCls}-${panelName}-panel`;

  const cellPrefixCls = `${prefixCls}-cell`;

  const isWeek = mode === 'week';

  // ========================== Base ==========================
  const [info, now] = useInfo(props, mode);
  const weekFirstDay = generateConfig.locale.getWeekFirstDay(locale.locale);
  const monthStartDate = generateConfig.setDate(pickerValue, 1);
  const baseDate = getWeekStartDate(locale.locale, generateConfig, monthStartDate);
  const month = generateConfig.getMonth(pickerValue);

  // =========================== PrefixColumn ===========================
  const showPrefixColumn = showWeek === undefined ? isWeek : showWeek;
  const prefixColumn = showPrefixColumn
    ? (date: DateType) => {
        // >>> Additional check for disabled
        const disabled = disabledDate?.(date, { type: 'week' });

        return (
          <td
            key="week"
            className={clsx(cellPrefixCls, `${cellPrefixCls}-week`, {
              [`${cellPrefixCls}-disabled`]: disabled,
            })}
            // Operation: Same as code in PanelBody
            onClick={() => {
              if (!disabled) {
                onSelect(date);
              }
            }}
            onMouseEnter={() => {
              if (!disabled) {
                onHover?.(date);
              }
            }}
            onMouseLeave={() => {
              if (!disabled) {
                onHover?.(null);
              }
            }}
          >
            <div className={`${cellPrefixCls}-inner`}>
              {generateConfig.locale.getWeek(locale.locale, date)}
            </div>
          </td>
        );
      }
    : null;

  // ========================= Cells ==========================
  // >>> Header Cells
  const headerCells: React.ReactNode[] = [];
  const weekDaysLocale: string[] =
    locale.shortWeekDays ||
    (generateConfig.locale.getShortWeekDays
      ? generateConfig.locale.getShortWeekDays(locale.locale)
      : []);

  if (prefixColumn) {
    headerCells.push(
      <th key="empty">
        <span style={{ width: 0, height: 0, position: 'absolute', overflow: 'hidden', opacity: 0 }}>
          {locale.week}
        </span>
      </th>,
    );
  }
  for (let i = 0; i < WEEK_DAY_COUNT; i += 1) {
    headerCells.push(<th key={i}>{weekDaysLocale[(i + weekFirstDay) % WEEK_DAY_COUNT]}</th>);
  }

  // >>> Body Cells
  const getCellDate = (date: DateType, offset: number) => {
    return generateConfig.addDate(date, offset);
  };

  const getCellText = (date: DateType) => {
    return formatValue(date, {
      locale,
      format: locale.cellDateFormat!,
      generateConfig,
    });
  };

  const getCellClassName = (date: DateType) => {
    const classObj = {
      [`${prefixCls}-cell-in-view`]: isSameMonth(generateConfig, date, pickerValue),
      [`${prefixCls}-cell-today`]: isSameDate(generateConfig, date, now),
    };

    return classObj;
  };

  // ========================= Header =========================
  const monthsLocale: string[] =
    locale.shortMonths ||
    (generateConfig.locale.getShortMonths
      ? generateConfig.locale.getShortMonths(locale.locale)
      : []);

  const yearNode: React.ReactNode = (
    <button
      aria-label={locale.yearSelect}
      className={`${prefixCls}-year-btn`}
      key="year"
      tabIndex={-1}
      type="button"
      onClick={() => {
        onModeChange('year', pickerValue);
      }}
    >
      {formatValue(pickerValue, {
        locale,
        format: locale.yearFormat!,
        generateConfig,
      })}
    </button>
  );
  const monthNode: React.ReactNode = (
    <button
      aria-label={locale.monthSelect}
      className={`${prefixCls}-month-btn`}
      key="month"
      tabIndex={-1}
      type="button"
      onClick={() => {
        onModeChange('month', pickerValue);
      }}
    >
      {locale.monthFormat
        ? formatValue(pickerValue, {
            locale,
            format: locale.monthFormat,
            generateConfig,
          })
        : monthsLocale[month]}
    </button>
  );

  const monthYearNodes = locale.monthBeforeYear ? [monthNode, yearNode] : [yearNode, monthNode];

  // ========================= Render =========================
  return (
    <PanelContext value={info}>
      <div className={clsx(panelPrefixCls, showWeek && `${panelPrefixCls}-show-week`)}>
        {/* Header */}
        <PanelHeader<DateType>
          offset={(distance) => generateConfig.addMonth(pickerValue, distance)}
          superOffset={(distance) => generateConfig.addYear(pickerValue, distance)}
          getEnd={(date) => {
            let clone = generateConfig.setDate(date, 1);
            clone = generateConfig.addMonth(clone, 1);
            return generateConfig.addDate(clone, -1);
          }}
          onChange={onPickerValueChange}
          // Limitation
          getStart={(date) => generateConfig.setDate(date, 1)}
        >
          {monthYearNodes}
        </PanelHeader>

        {/* Body */}
        <PanelBody
          titleFormat={locale.fieldDateFormat}
          {...props}
          cellSelection={!isWeek}
          colNum={WEEK_DAY_COUNT}
          getCellText={getCellText}
          prefixColumn={prefixColumn}
          rowNum={6}
          baseDate={baseDate}
          // Header
          headerCells={headerCells}
          getCellClassName={getCellClassName}
          // Body
          getCellDate={getCellDate}
        />
      </div>
    </PanelContext>
  );
}
