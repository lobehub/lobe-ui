import { Block, Button, Flexbox, Grid, Tag, Text, useTranslation } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { motion } from 'motion/react';

import { I18nProvider } from '@/i18n';
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
    actions: ['common.confirm', 'common.cancel', 'common.delete', 'common.edit'],
    description: 'Buttons and confirmations used across the app.',
    title: 'Common actions',
  },
  {
    actions: ['form.submit', 'form.reset'],
    description: 'Form submit actions and warnings.',
    details: ['form.unsavedChanges', 'form.unsavedWarning'],
    title: 'Forms',
  },
  {
    actions: ['emojiPicker.upload', 'emojiPicker.uploadBtn', 'emojiPicker.delete'],
    description: 'Upload and editing prompts.',
    details: ['emojiPicker.draggerDesc'],
    title: 'Emoji picker',
  },
  {
    description: 'Shortcuts and token status labels.',
    details: [
      'hotkey.placeholder',
      'hotkey.reset',
      'tokenTag.used',
      'tokenTag.remained',
      'tokenTag.overload',
    ],
    title: 'Hotkeys and tokens',
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
          <Text type="secondary">Active locale</Text>
          <Tag color="blue">{control.locale}</Tag>
          <Text type="secondary">Resources</Text>
          <Tag color="geekblue">Static</Tag>
        </Block>
        <I18nProvider locale={control.locale} motion={motion} resources={resources}>
          <LocalePreview />
        </I18nProvider>
      </Flexbox>
    </StoryBook>
  );
};
