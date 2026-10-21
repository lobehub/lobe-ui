import 'dayjs/locale/zh-cn';

import {
  ConfigProvider,
  datePickerLocaleEnUS,
  datePickerLocaleZhCN,
  DayjsDatePicker as DatePicker,
  DayjsDateRangePicker as DateRangePicker,
  Flexbox,
  type PickerLocaleInput,
  Segmented,
  Text,
} from '@lobehub/ui';
import dayjs from 'dayjs';
import { motion } from 'motion/react';
import { useState } from 'react';

import * as enResources from '@/i18n/resources/en';
import * as zhCnResources from '@/i18n/resources/zhCn';

type Lang = 'en' | 'zh-CN';

const defaultValue = dayjs('2026-10-14 09:30:00');

const Pickers = ({ locale }: { locale?: PickerLocaleInput }) => (
  <Flexbox gap={8}>
    <DatePicker locale={locale} />
    <DatePicker locale={locale} picker="week" />
    <DatePicker showTime defaultValue={defaultValue} locale={locale} />
    <DateRangePicker locale={locale} />
    <DateRangePicker locale={locale} picker="quarter" />
    <DatePicker locale={locale} picker="time" />
  </Flexbox>
);

export default () => {
  const [lang, setLang] = useState<Lang>('zh-CN');
  const isZh = lang === 'zh-CN';

  return (
    <Flexbox gap={16} padding={16}>
      <Segmented
        value={lang}
        options={[
          { label: 'English', value: 'en' },
          { label: '简体中文', value: 'zh-CN' },
        ]}
        onChange={(value) => setLang(value as Lang)}
      />
      <Flexbox horizontal gap={24} style={{ flexWrap: 'wrap' }}>
        <Flexbox gap={8} style={{ minWidth: 280 }}>
          <Text strong>locale prop</Text>
          <Text type="secondary">
            {isZh ? 'datePickerLocaleZhCN' : 'datePickerLocaleEnUS'} — texts, header formats and the
            dayjs locale of the panel
          </Text>
          <Pickers locale={isZh ? datePickerLocaleZhCN : datePickerLocaleEnUS} />
        </Flexbox>
        <Flexbox gap={8} style={{ minWidth: 280 }}>
          <Text strong>@lobehub/ui/i18n ConfigProvider</Text>
          <Text type="secondary">
            Texts from the i18n resources (no locale prop); only lang.locale is set so week / month
            names do not depend on the global dayjs.locale()
          </Text>
          <ConfigProvider
            locale={lang}
            motion={motion}
            resources={isZh ? zhCnResources : enResources}
          >
            <Pickers locale={{ lang: { locale: isZh ? 'zh_CN' : 'en_US' } }} />
          </ConfigProvider>
        </Flexbox>
      </Flexbox>
    </Flexbox>
  );
};
