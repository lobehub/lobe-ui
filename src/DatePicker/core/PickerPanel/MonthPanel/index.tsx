import * as React from 'react';

import type { DisabledDate, SharedPanelProps } from '../../interface';
import { formatValue } from '../../utils/dateUtil';
import { PanelContext, useInfo } from '../context';
import PanelBody from '../PanelBody';
import PanelHeader from '../PanelHeader';

export default function MonthPanel<DateType extends object = any>(
  props: SharedPanelProps<DateType>,
) {
  const {
    prefixCls,
    locale,
    generateConfig,
    pickerValue,
    disabledDate,
    onPickerValueChange,
    onModeChange,
  } = props;

  const panelPrefixCls = `${prefixCls}-month-panel`;

  // ========================== Base ==========================
  const [info] = useInfo(props, 'month');
  const baseDate = generateConfig.setMonth(pickerValue, 0);

  // ========================= Month ==========================
  const monthsLocale: string[] =
    locale.shortMonths ||
    (generateConfig.locale.getShortMonths
      ? generateConfig.locale.getShortMonths(locale.locale)
      : []);

  // ========================= Cells ==========================
  const getCellDate = (date: DateType, offset: number) => {
    return generateConfig.addMonth(date, offset);
  };

  const getCellText = (date: DateType) => {
    const month = generateConfig.getMonth(date);

    return locale.monthFormat
      ? formatValue(date, {
          locale,
          format: locale.monthFormat,
          generateConfig,
        })
      : monthsLocale[month];
  };

  const getCellClassName = () => ({
    [`${prefixCls}-cell-in-view`]: true,
  });

  // ======================== Disabled ========================
  const mergedDisabledDate: DisabledDate<DateType> | null = disabledDate
    ? (currentDate, disabledInfo) => {
        const startDate = generateConfig.setDate(currentDate, 1);
        const nextMonthStartDate = generateConfig.setMonth(
          startDate,
          generateConfig.getMonth(startDate) + 1,
        );
        const endDate = generateConfig.addDate(nextMonthStartDate, -1);

        return disabledDate(startDate, disabledInfo) && disabledDate(endDate, disabledInfo);
      }
    : null;

  // ========================= Header =========================
  const yearNode: React.ReactNode = (
    <button
      aria-label={locale.yearSelect}
      className={`${prefixCls}-year-btn`}
      key="year"
      tabIndex={-1}
      type="button"
      onClick={() => {
        onModeChange('year');
      }}
    >
      {formatValue(pickerValue, {
        locale,
        format: locale.yearFormat!,
        generateConfig,
      })}
    </button>
  );

  // ========================= Render =========================
  return (
    <PanelContext value={info}>
      <div className={panelPrefixCls}>
        {/* Header */}
        <PanelHeader
          getEnd={(date) => generateConfig.setMonth(date, 11)}
          superOffset={(distance) => generateConfig.addYear(pickerValue, distance)}
          onChange={onPickerValueChange}
          // Limitation
          getStart={(date) => generateConfig.setMonth(date, 0)}
        >
          {yearNode}
        </PanelHeader>

        {/* Body */}
        <PanelBody
          {...props}
          colNum={3}
          disabledDate={mergedDisabledDate}
          getCellClassName={getCellClassName}
          getCellText={getCellText}
          rowNum={4}
          titleFormat={locale.fieldMonthFormat}
          baseDate={baseDate}
          // Body
          getCellDate={getCellDate}
        />
      </div>
    </PanelContext>
  );
}
