import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import localeData from 'dayjs/plugin/localeData.js';
import weekday from 'dayjs/plugin/weekday.js';
import weekOfYear from 'dayjs/plugin/weekOfYear.js';
import weekYear from 'dayjs/plugin/weekYear.js';

import type { GenerateConfig } from '.';

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

dayjs.extend((o, c) => {
  // todo support Wo (ISO week)
  const proto = c.prototype;
  const oldFormat = proto.format;
  proto.format = function f(formatStr: string) {
    const str = (formatStr || '').replace('Wo', 'wo');
    return oldFormat.bind(this)(str);
  };
});

type IlocaleMapObject = Record<string, string>;
const localeMap: IlocaleMapObject = {
  // ar_EG:
  // az_AZ:
  // bg_BG:
  bn_BD: 'bn-bd',
  by_BY: 'be',
  // ca_ES:
  // cs_CZ:
  // da_DK:
  // de_DE:
  // el_GR:
  en_GB: 'en-gb',
  en_US: 'en',
  // es_ES:
  // et_EE:
  // fa_IR:
  // fi_FI:
  fr_BE: 'fr', // todo: dayjs has no fr_BE locale, use fr at present
  fr_CA: 'fr-ca',
  // fr_FR:
  // ga_IE:
  // gl_ES:
  // he_IL:
  // hi_IN:
  // hr_HR:
  // hu_HU:
  hy_AM: 'hy-am',
  // id_ID:
  // is_IS:
  // it_IT:
  // ja_JP:
  // ka_GE:
  // kk_KZ:
  // km_KH:
  kmr_IQ: 'ku',
  // kn_IN:
  // ko_KR:
  // ku_IQ: // previous ku in antd
  // lt_LT:
  // lv_LV:
  // mk_MK:
  // ml_IN:
  // mn_MN:
  // ms_MY:
  // nb_NO:
  // ne_NP:
  nl_BE: 'nl-be',
  // nl_NL:
  // pl_PL:
  pt_BR: 'pt-br',
  // pt_PT:
  // ro_RO:
  // ru_RU:
  // sk_SK:
  // sl_SI:
  // sr_RS:
  // sv_SE:
  // ta_IN:
  // th_TH:
  // tr_TR:
  // uk_UA:
  // ur_PK:
  // vi_VN:
  zh_CN: 'zh-cn',
  zh_HK: 'zh-hk',
  zh_TW: 'zh-tw',
};

const parseLocale = (locale: string) => {
  const mapLocale = localeMap[locale];
  return mapLocale || locale.split('_')[0];
};

/* istanbul ignore next */
const parseNoMatchNotice = () => {
  // zombieJ:
  // When user typing, its always miss match format.
  // This check is meaningless.
  // https://github.com/ant-design/ant-design/issues/51839
  // noteOnce(false, 'Not match any format. Please help to fire a issue about this.');
};

// Use internal dayjs instance to avoid implicit dependency on plugins extended by external dayjs versions
const getUDayjs = (value: Dayjs): Dayjs => {
  if (!dayjs.isDayjs(value) || value instanceof dayjs) {
    return value;
  }

  return dayjs(value.valueOf());
};

const generateConfig: GenerateConfig<Dayjs> = {
  // get
  getNow: () => {
    const now: Dayjs & { tz?: () => Dayjs } = dayjs();
    // https://github.com/ant-design/ant-design/discussions/50934
    if (typeof now.tz === 'function') {
      return now.tz(); // use default timezone
    }
    return now;
  },
  getFixedDate: (string) => dayjs(string, ['YYYY-M-DD', 'YYYY-MM-DD']),
  getEndDate: (date) => getUDayjs(date).endOf('month'),
  getWeekDay: (date) => {
    const clone = getUDayjs(date).locale('en');
    return clone.weekday() + clone.localeData().firstDayOfWeek();
  },
  getYear: (date) => getUDayjs(date).year(),
  getMonth: (date) => getUDayjs(date).month(),
  getDate: (date) => getUDayjs(date).date(),
  getHour: (date) => getUDayjs(date).hour(),
  getMinute: (date) => getUDayjs(date).minute(),
  getSecond: (date) => getUDayjs(date).second(),
  getMillisecond: (date) => getUDayjs(date).millisecond(),

  // set
  addYear: (date, diff) => getUDayjs(date).add(diff, 'year'),
  addMonth: (date, diff) => getUDayjs(date).add(diff, 'month'),
  addDate: (date, diff) => getUDayjs(date).add(diff, 'day'),
  setYear: (date, year) => getUDayjs(date).year(year),
  setMonth: (date, month) => getUDayjs(date).month(month),
  setDate: (date, num) => getUDayjs(date).date(num),
  setHour: (date, hour) => getUDayjs(date).hour(hour),
  setMinute: (date, minute) => getUDayjs(date).minute(minute),
  setSecond: (date, second) => getUDayjs(date).second(second),
  setMillisecond: (date, milliseconds) => getUDayjs(date).millisecond(milliseconds),

  // Compare
  isAfter: (date1, date2) => getUDayjs(date1).isAfter(getUDayjs(date2)),
  isValidate: (date) => getUDayjs(date).isValid(),

  locale: {
    getWeekFirstDay: (locale) => dayjs().locale(parseLocale(locale)).localeData().firstDayOfWeek(),
    getWeekFirstDate: (locale, date) => getUDayjs(date).locale(parseLocale(locale)).weekday(0),
    getWeek: (locale, date) => getUDayjs(date).locale(parseLocale(locale)).week(),
    getShortWeekDays: (locale) => dayjs().locale(parseLocale(locale)).localeData().weekdaysMin(),
    getShortMonths: (locale) => dayjs().locale(parseLocale(locale)).localeData().monthsShort(),
    format: (locale, date, format) => getUDayjs(date).locale(parseLocale(locale)).format(format),
    parse: (locale, text, formats) => {
      const localeStr = parseLocale(locale);
      for (let i = 0; i < formats.length; i += 1) {
        const format = formats[i];
        const formatText = text;
        if (format.includes('wo') || format.includes('Wo')) {
          // parse Wo
          const year = formatText.split('-')[0];
          const weekStr = formatText.split('-')[1];
          const firstWeek = dayjs(year, 'YYYY').startOf('year').locale(localeStr);
          for (let j = 0; j <= 52; j += 1) {
            const nextWeek = firstWeek.add(j, 'week');
            if (nextWeek.format('Wo') === weekStr) {
              return nextWeek;
            }
          }
          parseNoMatchNotice();
          return null;
        }
        const date = dayjs(formatText, format, true).locale(localeStr);
        if (date.isValid()) {
          return date;
        }
      }

      if (text) {
        parseNoMatchNotice();
      }
      return null;
    },
  },
};

export default generateConfig;
