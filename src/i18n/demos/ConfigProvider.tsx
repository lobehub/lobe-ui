import { Button, useTranslation } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { Card, Col, Row, Space, Tag, Typography } from 'antd';
import { motion } from 'motion/react';

import ConfigProvider from '@/ConfigProvider';
import * as enResources from '@/i18n/resources/en';
import * as zhCnResources from '@/i18n/resources/zhCn';
import type { TranslationKey } from '@/i18n/types';

const { Text } = Typography;

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
    <Row gutter={[20, 20]}>
      {sections.map((section) => (
        <Col key={section.title} lg={12} xs={24}>
          <Card title={section.title}>
            <Text type="secondary">{section.description}</Text>
            {section.actions ? (
              <Space wrap size={[8, 8]} style={{ marginTop: 16 }}>
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
              </Space>
            ) : null}
            {section.details ? (
              <Space direction="vertical" size={8} style={{ marginTop: 16 }}>
                {section.details.map((key) => (
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
                    <Text>{t(key as TranslationKey)}</Text>
                  </Space>
                ))}
              </Space>
            ) : null}
          </Card>
        </Col>
      ))}
    </Row>
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
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Card size="small">
          <Space wrap align="center">
            <Text type="secondary">Provider</Text>
            <Tag color="geekblue">ConfigProvider</Tag>
            <Text type="secondary">Locale</Text>
            <Tag color="blue">{control.locale}</Tag>
            <Text type="secondary">Proxy</Text>
            <Tag>aliyun</Tag>
          </Space>
        </Card>
        <ConfigProvider
          config={{ proxy: 'aliyun' }}
          locale={control.locale}
          motion={motion}
          resources={resources}
        >
          <LocalePreview />
        </ConfigProvider>
      </Space>
    </StoryBook>
  );
};
