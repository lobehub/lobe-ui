import { Button, useTranslation } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { Card, Space } from 'antd';
import { useState } from 'react';

import ConfigProvider from '@/ConfigProvider';
import { I18nProvider } from '@/i18n';
import * as enResources from '@/i18n/resources/en';
import commonMessages from '@/i18n/resources/en/common';
import * as zhCnResources from '@/i18n/resources/zhCn';

const LocaleContent = () => {
  const { t } = useTranslation(commonMessages);

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card title="Common Translations">
        <Space wrap>
          <Button type="primary">{t('common.confirm')}</Button>
          <Button>{t('common.cancel')}</Button>
          <Button danger>{t('common.delete')}</Button>
          <Button>{t('common.edit')}</Button>
        </Space>
      </Card>

      <Card title="Form Translations">
        <Space wrap>
          <Button type="primary">{t('form.submit')}</Button>
          <Button>{t('form.reset')}</Button>
        </Space>
        <div style={{ color: '#888', marginTop: 8 }}>{t('form.unsavedChanges')}</div>
      </Card>

      <Card title="Emoji Picker Translations">
        <Space>
          <Button>{t('emojiPicker.upload')}</Button>
          <Button type="primary">{t('emojiPicker.uploadBtn')}</Button>
          <Button danger>{t('emojiPicker.delete')}</Button>
        </Space>
        <div style={{ color: '#888', marginTop: 8 }}>{t('emojiPicker.draggerDesc')}</div>
      </Card>

      <Card title="Editable Message Translations">
        <Space wrap>
          <Button>{t('editableMessage.input')}</Button>
          <Button>{t('editableMessage.output')}</Button>
          <Button type="primary">{t('editableMessage.addProps')}</Button>
        </Space>
      </Card>

      <Card title="Hotkey Translations">
        <div style={{ marginBottom: 8 }}>
          <strong>{t('hotkey.placeholder')}</strong>
        </div>
        <Button>{t('hotkey.reset')}</Button>
      </Card>

      <Card title="Token Tag Translations">
        <Space>
          <span>
            <strong>Token Status:</strong>
          </span>
          <span>{t('tokenTag.used')}</span>
          <span>|</span>
          <span>{t('tokenTag.remained')}</span>
          <span>|</span>
          <span>{t('tokenTag.overload')}</span>
        </Space>
      </Card>
    </Space>
  );
};

export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      locale: {
        options: ['en', 'zhCn'],
        value: 'en',
      },
      useConfigProvider: {
        label: 'Use ConfigProvider',
        value: false,
      },
    },
    { store },
  );

  const [locale, setLocale] = useState(control.locale);
  const { useConfigProvider } = control;

  return (
    <StoryBook levaStore={store}>
      <Card>
        <Space align="center">
          <span>Current Locale:</span>
          <Space>
            <Button onClick={() => setLocale('en')} type={locale === 'en' ? 'primary' : 'default'}>
              English
            </Button>
            <Button
              onClick={() => setLocale('zhCn')}
              type={locale === 'zhCn' ? 'primary' : 'default'}
            >
              简体中文
            </Button>
          </Space>
        </Space>
      </Card>

      {useConfigProvider ? (
        <ConfigProvider
          config={{ proxy: 'aliyun' }}
          locale={locale}
          resources={locale === 'en' ? enResources : zhCnResources}
        >
          <LocaleContent />
        </ConfigProvider>
      ) : (
        <I18nProvider locale={locale} resources={locale === 'en' ? enResources : zhCnResources}>
          <LocaleContent />
        </I18nProvider>
      )}
    </StoryBook>
  );
};
