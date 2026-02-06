import { Button, useTranslation } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { Card, Space, Tag, Typography } from 'antd';
import { motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { I18nProvider } from '@/i18n';

const { Text } = Typography;

const Preview = ({ loading, requestedLocale }: { loading: boolean; requestedLocale: string }) => {
  const { t, locale } = useTranslation();
  const isReady = !loading && locale === requestedLocale;

  return (
    <Card title="Dynamic import resources">
      <Space wrap align="center">
        <Text type="secondary">Requested</Text>
        <Tag color="blue">{requestedLocale}</Tag>
        <Text type="secondary">Active</Text>
        <Tag color={locale === requestedLocale ? 'green' : 'gold'}>{locale}</Tag>
        <Tag color={isReady ? 'green' : 'gold'}>{isReady ? 'Ready' : 'Loading'}</Tag>
      </Space>
      <Space wrap size={[8, 8]} style={{ marginTop: 16 }}>
        <Button size="small" type="primary">
          {t('common.confirm')}
        </Button>
        <Button size="small">{t('common.cancel')}</Button>
        <Button danger size="small">
          {t('common.delete')}
        </Button>
      </Space>
      <Space direction="vertical" size={8} style={{ marginTop: 16 }}>
        {(['form.unsavedChanges', 'emojiPicker.draggerDesc'] as const).map((key) => (
          <Space direction="vertical" key={key} size={2}>
            <Text
              type="secondary"
              style={{
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                fontSize: 12,
                wordBreak: 'break-word',
              }}
            >
              {key}
            </Text>
            <Text>{t(key)}</Text>
          </Space>
        ))}
      </Space>
    </Card>
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
    },
    { store },
  );

  const resourcePromise = useMemo(
    () =>
      control.locale === 'en' ? import('@/i18n/resources/en') : import('@/i18n/resources/zhCn'),
    [control.locale],
  );
  const [loading, setLoading] = useState(false);
  const latestRequestId = useRef(0);

  useEffect(() => {
    const requestId = ++latestRequestId.current;
    setLoading(true);
    resourcePromise
      .then(() => {
        if (latestRequestId.current !== requestId) return;
        setLoading(false);
      })
      .catch(() => {
        if (latestRequestId.current !== requestId) return;
        setLoading(false);
      });
  }, [resourcePromise]);

  return (
    <StoryBook levaStore={store}>
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Card size="small">
          <Space wrap align="center">
            <Text type="secondary">Resources</Text>
            <Tag color="geekblue">Promise</Tag>
            <Text type="secondary">Requested locale</Text>
            <Tag color="blue">{control.locale}</Tag>
          </Space>
        </Card>
        <I18nProvider locale={control.locale} motion={motion} resources={resourcePromise}>
          <Preview loading={loading} requestedLocale={control.locale} />
        </I18nProvider>
      </Space>
    </StoryBook>
  );
};
