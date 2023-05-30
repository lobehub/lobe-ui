import { Icon, Snippet } from '@lobehub/ui';
import { Divider, Space, Typography } from 'antd';
import { useResponsive } from 'antd-style';
import { Edit3, Github } from 'lucide-react';
import { ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { ApiHeaderProps } from '@/index';

import { useStyles } from './style';

export interface ApiTitleProps extends ApiHeaderProps {
  /**
   * @title 服务列表
   * @description 可选，若存在则展示 API 服务列表
   */
  serviceList?: ServiceItem[];
  /**
   * @title 标题
   */
  title: string;
}

export interface ServiceItem {
  /**
   * @title 服务描述
   */
  children: string;
  /**
   * @title 服务图标
   */
  icon: ReactNode;
  /**
   * @title 服务标签
   */
  label: string;
  /**
   * @title 服务链接
   */
  url: string;
}

export const ApiHeader = memo<ApiTitleProps>(
  ({
    title,
    componentName,
    description,
    defaultImport,
    pkg,
    sourceUrl,
    docUrl,
    serviceList = [],
  }) => {
    const { styles } = useStyles();
    const { mobile } = useResponsive();

    const items = [
      sourceUrl && {
        icon: <Icon icon={Github} />,
        children: 'Source',
        url: sourceUrl,
      },
      docUrl && {
        icon: <Icon icon={Edit3} />,
        children: 'Edit',
        url: docUrl,
      },
    ].filter((i) => i) as ServiceItem[];

    const importStr = defaultImport
      ? `import ${componentName} from '${pkg}';`
      : `import { ${componentName} } from '${pkg}';`;

    return (
      <Flexbox>
        <Typography.Title className={styles.title}>{title}</Typography.Title>
        {description && (
          <div>
            <Typography.Text className={styles.desc} type={'secondary'}>
              {description}
            </Typography.Text>
          </div>
        )}
        <Flexbox gap={mobile ? 16 : 24} style={{ marginTop: 16 }}>
          <div style={{ display: 'flex' }}>
            <Snippet>{importStr}</Snippet>
          </div>
          <Divider dashed style={{ margin: '2px 0' }} />
          <Flexbox distribution={'space-between'} gap={mobile ? 24 : 0} horizontal={!mobile}>
            <Space split={<Divider type={'vertical'} />} wrap>
              {serviceList.map((item) => (
                <a
                  href={item.url}
                  key={item.label}
                  rel="noreferrer"
                  target={'_blank'}
                  title={item.label}
                >
                  <Flexbox align={'center'} className={styles.text} gap={8} horizontal>
                    {item.icon}
                    {item.children}
                  </Flexbox>
                </a>
              ))}
            </Space>
            <Space className={styles.meta} split={<Divider type={'vertical'} />}>
              {items.map((item) => (
                <a href={item.url} key={item.url} rel="noreferrer" target={'_blank'}>
                  <Flexbox align={'center'} className={styles.text} gap={8} horizontal>
                    {item.icon}
                    {item.children}
                  </Flexbox>
                </a>
              ))}
            </Space>
          </Flexbox>
        </Flexbox>
      </Flexbox>
    );
  },
);
