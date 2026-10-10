import { Block, Button, Flexbox, Grid, Tag, Text, useTranslation } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { motion } from 'motion/react';

import ConfigProvider from '@/ConfigProvider';
import * as enResources from '@/i18n/resources/en';
import * as zhCnResources from '@/i18n/resources/zhCn';
import type { TranslationKey } from '@/i18n/types';

type Section = {
  actions?: readonly string[];
  description: string;
  details?: readonly string[];
  title: string;
};

const sections: Section[] = [
  {
    actions: ['common.confirm', 'common.cancel', 'common.delete'],
    description: 'Common actions using ConfigProvider i18n.',
    title: 'Common actions',
  },
  {
    description: 'Chat and modal labels.',
    details: ['chat.placeholder', 'messageModal.confirm', 'messageModal.cancel'],
    title: 'Chat and modal',
  },
];

const LocalePreview = () => {
  const { t } = useTranslation();

  return (
    <Grid gap={20} maxItemWidth={320} rows={2}>
      {sections.map((section) => (
        <Block gap={16} key={section.title} padding={16} variant="outlined">
          <Flexbox gap={4}>
            <Text strong>{section.title}</Text>
            <Text type="secondary">{section.description}</Text>
          </Flexbox>
          {section.actions ? (
            <Flexbox horizontal gap={8} wrap="wrap">
              {section.actions.map((key, index) => (
                <Button
                  danger={key.includes('delete')}
                  key={key}
                  size="small"
                  type={index === 0 ? 'primary' : 'default'}
                >
                  {t(key as TranslationKey)}
                </Button>
              ))}
            </Flexbox>
          ) : null}
          {section.details ? (
            <Flexbox gap={8}>
              {section.details.map((key) => (
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
                  <Text>{t(key as TranslationKey)}</Text>
                </Flexbox>
              ))}
            </Flexbox>
          ) : null}
        </Block>
      ))}
    </Grid>
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

  const resources = control.locale === 'en' ? enResources : zhCnResources;

  return (
    <StoryBook levaStore={store}>
      <Flexbox gap={16} width="100%">
        <Block horizontal align="center" gap={8} padding={12} variant="outlined" wrap="wrap">
          <Text type="secondary">Provider</Text>
          <Tag color="geekblue">ConfigProvider</Tag>
          <Text type="secondary">Locale</Text>
          <Tag color="blue">{control.locale}</Tag>
          <Text type="secondary">Proxy</Text>
          <Tag>aliyun</Tag>
        </Block>
        <ConfigProvider
          config={{ proxy: 'aliyun' }}
          locale={control.locale}
          motion={motion}
          resources={resources}
        >
          <LocalePreview />
        </ConfigProvider>
      </Flexbox>
    </StoryBook>
  );
};
