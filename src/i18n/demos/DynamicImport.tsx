import { Block, Button, Flexbox, Tag, Text, useTranslation } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { I18nProvider } from '@/i18n';

const Preview = ({ loading, requestedLocale }: { loading: boolean; requestedLocale: string }) => {
  const { t, locale } = useTranslation();
  const isReady = !loading && locale === requestedLocale;

  return (
    <Block gap={16} padding={16} variant="outlined">
      <Text strong>Dynamic import resources</Text>
      <Flexbox horizontal align="center" gap={8} wrap="wrap">
        <Text type="secondary">Requested</Text>
        <Tag color="blue">{requestedLocale}</Tag>
        <Text type="secondary">Active</Text>
        <Tag color={locale === requestedLocale ? 'green' : 'gold'}>{locale}</Tag>
        <Tag color={isReady ? 'green' : 'gold'}>{isReady ? 'Ready' : 'Loading'}</Tag>
      </Flexbox>
      <Flexbox horizontal gap={8} wrap="wrap">
        <Button size="small" type="primary">
          {t('common.confirm')}
        </Button>
        <Button size="small">{t('common.cancel')}</Button>
        <Button danger size="small">
          {t('common.delete')}
        </Button>
      </Flexbox>
      <Flexbox gap={8}>
        {(['form.unsavedChanges', 'emojiPicker.draggerDesc'] as const).map((key) => (
          <Flexbox gap={2} key={key}>
            <Text
              fontSize={12}
              type="secondary"
              wordBreak="break-word"
              style={{
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              }}
            >
              {key}
            </Text>
            <Text>{t(key)}</Text>
          </Flexbox>
        ))}
      </Flexbox>
    </Block>
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
      <Flexbox gap={16} width="100%">
        <Block horizontal align="center" gap={8} padding={12} variant="outlined" wrap="wrap">
          <Text type="secondary">Resources</Text>
          <Tag color="geekblue">Promise</Tag>
          <Text type="secondary">Requested locale</Text>
          <Tag color="blue">{control.locale}</Tag>
        </Block>
        <I18nProvider locale={control.locale} motion={motion} resources={resourcePromise}>
          <Preview loading={loading} requestedLocale={control.locale} />
        </I18nProvider>
      </Flexbox>
    </StoryBook>
  );
};
