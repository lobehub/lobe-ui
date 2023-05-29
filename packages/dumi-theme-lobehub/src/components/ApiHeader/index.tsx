import { ApiHeaderProps } from '@/index';
import { Icon, Snippet } from '@lobehub/ui';
import { Divider, Space, Typography } from 'antd';
import { useResponsive } from 'antd-style';
import { Edit3, Github } from 'lucide-react';
import { FC, ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import { useStyles } from './style';

/**
 * @title API 标题属性
 * @extends ApiHeaderProps
 */
export interface ApiTitleProps extends ApiHeaderProps {
  /**
   * @title 标题
   */
  title: string;
  /**
   * @title 服务列表
   * @description 可选，若存在则展示 API 服务列表
   */
  serviceList?: ServiceItem[];
}

/**
 * @title 服务项
 */
export interface ServiceItem {
  /**
   * @title 服务标签
   */
  label: string;
  /**
   * @title 服务图标
   */
  icon: ReactNode;
  /**
   * @title 服务描述
   */
  children: string;
  /**
   * @title 服务链接
   */
  url: string;
}

export const ApiHeader: FC<ApiTitleProps> = memo(
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
        icon: <Icon icon={Github} size={{ fontSize: 15 }} />,
        children: 'Source',
        url: sourceUrl,
      },
      docUrl && {
        icon: <Icon icon={Edit3} size={{ fontSize: 15 }} />,
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
            <Typography.Text type={'secondary'} className={styles.desc}>
              {description}
            </Typography.Text>
          </div>
        )}
        <Flexbox style={{ marginTop: 16 }} gap={mobile ? 16 : 24}>
          <div style={{ display: 'flex' }}>
            <Snippet>{importStr}</Snippet>
          </div>
          <Divider dashed style={{ margin: '2px 0' }} />
          <Flexbox horizontal={!mobile} gap={mobile ? 24 : 0} distribution={'space-between'}>
            <Space split={<Divider type={'vertical'} />} wrap>
              {serviceList.map((item) => (
                <a
                  key={item.label}
                  href={item.url}
                  target={'_blank'}
                  rel="noreferrer"
                  title={item.label}
                >
                  <Flexbox horizontal align={'center'} gap={8} className={styles.text}>
                    <>{item.icon}</>
                    <>{item.children}</>
                  </Flexbox>
                </a>
              ))}
            </Space>

            <Space split={<Divider type={'vertical'} />} className={styles.meta}>
              {items.map((item) => (
                <a key={item.url} href={item.url} target={'_blank'} rel="noreferrer">
                  <Flexbox horizontal align={'center'} gap={8} className={styles.text}>
                    <>{item.icon}</>
                    <>{item.children}</>
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
