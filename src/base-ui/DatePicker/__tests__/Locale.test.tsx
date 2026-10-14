import 'dayjs/locale/zh-cn';

import enUS from '@rc-component/picker/locale/en_US';
import { act, cleanup, fireEvent, render as rtlRender, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

import ConfigProvider from '@/ConfigProvider';
import * as enResources from '@/i18n/resources/en';
import * as zhCnResources from '@/i18n/resources/zhCn';
import { MotionProvider } from '@/MotionProvider';

import DatePicker from '../DatePicker';
import DateRangePicker from '../DateRangePicker';
import { createPickerLocale, datePickerLocaleEnUS, datePickerLocaleZhCN } from '../locale';
import type { PickerLocale } from '../type';

dayjs.extend(buddhistEra);

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
}

const Wrapper = ({ children }: { children: ReactNode }) => (
  <MotionProvider motion={motion}>{children}</MotionProvider>
);
const render = (ui: ReactNode) => rtlRender(ui, { wrapper: Wrapper });
const renderZhCn = (ui: ReactNode) =>
  rtlRender(ui, {
    wrapper: ({ children }) => (
      <ConfigProvider locale="zh-CN" motion={motion} resources={zhCnResources}>
        {children}
      </ConfigProvider>
    ),
  });

const input = () => screen.getAllByRole('textbox')[0] as HTMLInputElement;
const inputs = () => screen.getAllByRole('textbox') as HTMLInputElement[];
const popup = () => document.querySelector<HTMLElement>('.lobe-picker-dropdown')!;
const open = () => act(() => fireEvent.click(input()));
const headerView = () => popup().querySelector('.lobe-picker-header-view')!.textContent;
const navLabels = () =>
  [...popup().querySelectorAll<HTMLElement>('.lobe-picker-header button')].map((node) =>
    node.getAttribute('aria-label'),
  );
const weekHeader = () =>
  [...popup().querySelectorAll('.lobe-picker-content thead th')].map((node) => node.textContent);
const footerText = () => popup().querySelector('.lobe-picker-footer')?.textContent;

const day = dayjs('2026-10-14 09:30:00');

const buddhistLocale: PickerLocale = {
  ...datePickerLocaleEnUS,
  lang: {
    ...datePickerLocaleEnUS.lang,
    cellYearFormat: 'BBBB',
    fieldDateFormat: 'BBBB-MM-DD',
    fieldDateTimeFormat: 'BBBB-MM-DD HH:mm:ss',
    yearFormat: 'BBBB',
  },
};

/** Every text key of antd's `locale/example.json` `lang`. */
const LANG_TEXT_KEYS = [
  'placeholder',
  'yearPlaceholder',
  'quarterPlaceholder',
  'monthPlaceholder',
  'weekPlaceholder',
  'rangePlaceholder',
  'rangeYearPlaceholder',
  'rangeQuarterPlaceholder',
  'rangeMonthPlaceholder',
  'rangeWeekPlaceholder',
  'today',
  'now',
  'backToToday',
  'ok',
  'clear',
  'week',
  'month',
  'year',
  'timeSelect',
  'dateSelect',
  'weekSelect',
  'monthSelect',
  'yearSelect',
  'decadeSelect',
  'previousMonth',
  'nextMonth',
  'previousYear',
  'nextYear',
  'previousDecade',
  'nextDecade',
  'previousCentury',
  'nextCentury',
] as const;

/** Format fields of the default locales (time formats are derived from `showTime`). */
const LANG_FORMAT_KEYS = [
  'fieldDateFormat',
  'fieldWeekFormat',
  'fieldMonthFormat',
  'fieldQuarterFormat',
  'fieldYearFormat',
  'yearFormat',
  'cellYearFormat',
  'cellQuarterFormat',
  'cellDateFormat',
] as const;

describe('DatePicker locale', () => {
  afterEach(() => {
    cleanup();
    dayjs.locale('en');
  });

  test('exported default locales carry every antd lang text and timePickerLocale', () => {
    for (const locale of [datePickerLocaleEnUS, datePickerLocaleZhCN]) {
      for (const key of LANG_TEXT_KEYS) expect(locale.lang[key]).toBeTruthy();
      expect(locale.timePickerLocale.placeholder).toBeTruthy();
      expect(locale.timePickerLocale.rangePlaceholder).toHaveLength(2);
      for (const key of LANG_FORMAT_KEYS) expect(locale.lang[key]).toBeTruthy();
      expect(locale.lang.shortWeekDays).toHaveLength(7);
      expect(locale.lang.shortMonths).toHaveLength(12);
    }
    expect(datePickerLocaleEnUS.lang).toMatchObject({
      locale: 'en_US',
      monthBeforeYear: true,
      nextCentury: 'Next century',
      placeholder: 'Select date',
      rangePlaceholder: ['Start date', 'End date'],
      today: 'Today',
      yearFormat: 'YYYY',
    });
    expect(datePickerLocaleZhCN.lang).toMatchObject({
      locale: 'zh_CN',
      monthBeforeYear: false,
      now: '此刻',
      ok: '确定',
      previousMonth: '上个月',
      quarterPlaceholder: '选择季度',
      rangeWeekPlaceholder: ['开始周', '结束周'],
      today: '今天',
      weekPlaceholder: '选择周',
      yearFormat: 'YYYY年',
    });
    expect(datePickerLocaleZhCN.lang.shortWeekDays?.[1]).toBe('一');
    expect(datePickerLocaleZhCN.lang.shortMonths?.[9]).toBe('10月');
    expect(datePickerLocaleEnUS.lang.fieldDateFormat).toBe('YYYY-MM-DD');
    expect(datePickerLocaleEnUS.lang.fieldTimeFormat).toBeUndefined();
    expect(datePickerLocaleZhCN.timePickerLocale).toEqual({
      placeholder: '选择时间',
      rangePlaceholder: ['开始时间', '结束时间'],
    });
  });

  test('the English texts match rc-picker en_US', () => {
    const rcTexts = Object.entries(enUS).filter(([, value]) => typeof value === 'string');
    for (const [key, value] of rcTexts) {
      if (key === 'locale') continue;
      expect([key, datePickerLocaleEnUS.lang[key as keyof typeof enUS]]).toEqual([key, value]);
    }
  });

  test('createPickerLocale builds from i18n resources and falls back to English', () => {
    const locale = createPickerLocale(
      { 'datePicker.ok': 'Valider', 'datePicker.today': "Aujourd'hui" },
      'fr_FR',
    );
    expect(locale.lang).toMatchObject({
      clear: 'Clear',
      locale: 'fr_FR',
      ok: 'Valider',
      today: "Aujourd'hui",
    });
    expect(createPickerLocale(enResources.datePicker).lang.locale).toBe('en_US');
  });

  test('by default the texts come from the i18n resources in context', () => {
    renderZhCn(<DatePicker showNow defaultPickerValue={day} />);
    expect(input().placeholder).toBe('选择日期');
    open();
    expect(navLabels()).toEqual(['上一年', '上个月', '选择年份', '选择月份', '下个月', '下一年']);
    expect(footerText()).toBe('今天');
    // zh-CN puts the year first, formatted as `YYYY年`.
    expect(headerView()?.startsWith('2026年')).toBe(true);
  });

  test('per-picker placeholders and timePickerLocale come from i18n', () => {
    const { rerender } = renderZhCn(<DatePicker picker="week" />);
    expect(input().placeholder).toBe('选择周');
    rerender(<DatePicker picker="quarter" />);
    expect(input().placeholder).toBe('选择季度');
    rerender(<DatePicker picker="time" />);
    expect(input().placeholder).toBe('选择时间');
    cleanup();
    renderZhCn(<DateRangePicker picker="time" />);
    expect(inputs().map((node) => node.placeholder)).toEqual(['开始时间', '结束时间']);
  });

  test('the locale prop replaces the default locale, incl. footer buttons', () => {
    render(<DatePicker showNow showTime defaultPickerValue={day} locale={datePickerLocaleZhCN} />);
    expect(input().placeholder).toBe('选择日期');
    open();
    expect(footerText()).toBe('此刻确定');
    expect(navLabels()).toContain('上个月');
    // `lang.locale: 'zh_CN'` switches the dayjs locale of this picker only.
    expect(weekHeader()).toEqual(['一', '二', '三', '四', '五', '六', '日']);
    expect(headerView()).toBe('2026年10月');
  });

  test('a partial lang / timePickerLocale override is merged over the default', () => {
    const { rerender } = render(<DatePicker locale={{ lang: { placeholder: 'Pick a day' } }} />);
    expect(input().placeholder).toBe('Pick a day');
    // The `placeholder` prop still wins.
    rerender(
      <DatePicker locale={{ lang: { placeholder: 'Pick a day' } }} placeholder="Explicit" />,
    );
    expect(input().placeholder).toBe('Explicit');
    rerender(<DatePicker locale={{ timePickerLocale: { placeholder: 'When?' } }} picker="time" />);
    expect(input().placeholder).toBe('When?');
    cleanup();
    render(
      <DateRangePicker
        locale={{ lang: { rangeMonthPlaceholder: ['From', 'To'] } }}
        picker="month"
      />,
    );
    expect(inputs().map((node) => node.placeholder)).toEqual(['From', 'To']);
  });

  test('shortWeekDays / shortMonths override the dayjs names', () => {
    render(
      <DatePicker
        defaultPickerValue={day}
        locale={{
          lang: {
            shortMonths: [
              'M1',
              'M2',
              'M3',
              'M4',
              'M5',
              'M6',
              'M7',
              'M8',
              'M9',
              'M10',
              'M11',
              'M12',
            ],
            shortWeekDays: ['S0', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6'],
          },
        }}
      />,
    );
    open();
    expect(weekHeader()).toEqual(['S0', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6']);
    expect(headerView()).toBe('M102026');
  });

  test('format fields drive the input text and panel headers (Buddhist era)', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <DatePicker defaultValue={day} locale={buddhistLocale} onChange={onChange} />,
    );
    expect(input().value).toBe('2569-10-14');
    open();
    expect(headerView()).toBe('Oct2569');
    rerender(<DatePicker showTime defaultValue={day} locale={buddhistLocale} />);
    expect(input().value).toBe('2569-10-14 09:30:00');
  });

  test('field formats per picker and header formats', () => {
    const { rerender } = render(
      <DatePicker
        defaultValue={day}
        locale={{ lang: { fieldMonthFormat: 'MM/YYYY' } }}
        picker="month"
      />,
    );
    expect(input().value).toBe('10/2026');
    rerender(
      <DatePicker
        defaultValue={day}
        locale={{ lang: { fieldYearFormat: '[Y]YYYY' } }}
        picker="year"
      />,
    );
    expect(input().value).toBe('Y2026');
    rerender(
      <DatePicker
        defaultValue={day}
        locale={{ lang: { fieldQuarterFormat: '[Q]Q YYYY' } }}
        picker="quarter"
      />,
    );
    expect(input().value).toBe('Q4 2026');
  });

  test('without a locale.lang.locale, the picker follows the active dayjs locale', () => {
    dayjs.locale('zh-cn');
    render(<DatePicker defaultPickerValue={day} />);
    open();
    expect(weekHeader()).toEqual(['一', '二', '三', '四', '五', '六', '日']);
    // Texts still come from i18n (English here).
    expect(input().placeholder).toBe('Select date');
  });
});

describe('exported locale names', () => {
  afterEach(cleanup);

  test('datePickerLocaleZhCN carries Chinese week / month names itself', () => {
    // An unknown dayjs locale code: names can only come from the locale object.
    const locale = {
      ...datePickerLocaleZhCN,
      lang: { ...datePickerLocaleZhCN.lang, locale: 'xx' },
    };
    render(<DatePicker defaultPickerValue={day} locale={locale} picker="month" />);
    fireEvent.click(input());
    expect(
      [...popup().querySelectorAll('.lobe-picker-cell-inner')].map((node) => node.textContent),
    ).toContain('10月');
  });

  test('showTime keeps its own time format with the exported locale', () => {
    render(
      <DatePicker
        defaultValue={day}
        locale={datePickerLocaleEnUS}
        showTime={{ showSecond: false }}
      />,
    );
    expect(input().value).toBe('2026-10-14 09:30');
    cleanup();
    render(<DatePicker defaultValue={day} showTime={{ showSecond: false }} />);
    expect(input().value).toBe('2026-10-14 09:30');
  });
});
