import * as React from 'react';

import type { DisabledDate, SharedPanelProps } from '../../interface';
import { formatValue, isInRange, isSameYear } from '../../utils/dateUtil';
import { PanelContext, useInfo } from '../context';
import PanelBody from '../PanelBody';
import PanelHeader from '../PanelHeader';

export default function YearPanel<DateType extends object = any>(
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

  const panelPrefixCls = `${prefixCls}-year-panel`;

  // ========================== Base ==========================
  const [info] = useInfo(props, 'year');
  const getStartYear = (date: DateType) => {
    const startYear = Math.floor(generateConfig.getYear(date) / 10) * 10;
    return generateConfig.setYear(date, startYear);
  };
  const getEndYear = (date: DateType) => {
    const startYear = getStartYear(date);
    return generateConfig.addYear(startYear, 9);
  };

  const startYearDate = getStartYear(pickerValue);
  const endYearDate = getEndYear(pickerValue);

  const baseDate = generateConfig.addYear(startYearDate, -1);

  // ========================= Cells ==========================
  const getCellDate = (date: DateType, offset: number) => {
    return generateConfig.addYear(date, offset);
  };

  const getCellText = (date: DateType) => {
    return formatValue(date, {
      locale,
      format: locale.cellYearFormat!,
      generateConfig,
    });
  };

  const getCellClassName = (date: DateType) => {
    return {
      [`${prefixCls}-cell-in-view`]:
        isSameYear(generateConfig, date, startYearDate) ||
        isSameYear(generateConfig, date, endYearDate) ||
        isInRange(generateConfig, startYearDate, endYearDate, date),
    };
  };

  // ======================== Disabled ========================
  const mergedDisabledDate: DisabledDate<DateType> | null = disabledDate
    ? (currentDate, disabledInfo) => {
        // Start
        const startMonth = generateConfig.setMonth(currentDate, 0);
        const startDate = generateConfig.setDate(startMonth, 1);

        // End
        const endMonth = generateConfig.addYear(startDate, 1);
        const endDate = generateConfig.addDate(endMonth, -1);
        return disabledDate(startDate, disabledInfo) && disabledDate(endDate, disabledInfo);
      }
    : null;

  // ========================= Header =========================
  const yearNode: React.ReactNode = (
    <button
      aria-label={locale.decadeSelect}
      className={`${prefixCls}-decade-btn`}
      key="decade"
      tabIndex={-1}
      type="button"
      onClick={() => {
        onModeChange('decade');
      }}
    >
      {formatValue(startYearDate, {
        locale,
        format: locale.yearFormat!,
        generateConfig,
      })}
      -
      {formatValue(endYearDate, {
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
          getEnd={getEndYear}
          superOffset={(distance) => generateConfig.addYear(pickerValue, distance * 10)}
          onChange={onPickerValueChange}
          // Limitation
          getStart={getStartYear}
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
          titleFormat={locale.fieldYearFormat}
          baseDate={baseDate}
          // Body
          getCellDate={getCellDate}
        />
      </div>
    </PanelContext>
  );
}
