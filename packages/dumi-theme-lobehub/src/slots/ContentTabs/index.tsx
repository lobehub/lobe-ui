import { Tabs } from 'antd';
import { useIntl, useRouteMeta } from 'dumi';
import { memo, type FC } from 'react';

import { useStyles } from './style';

type IContentTabs = ReturnType<typeof useRouteMeta>['tabs'];

export interface IContentTabsProps {
  tabs: IContentTabs;
  tabKey: string | null;
  onChange: (tab?: NonNullable<IContentTabs>[0]) => void;
}

const ContentTabs: FC<IContentTabsProps> = memo(({ tabs, tabKey: key, onChange }) => {
  const intl = useIntl();
  const { styles } = useStyles();
  // TODO: tab.Extra & tab.Action render

  return !!tabs && Boolean(tabs?.length) ? (
    <Tabs
      data-page-tabs
      activeKey={key || 'default'}
      className={styles.cls}
      items={[
        { key: 'default', value: 'default', label: '文档' },
        ...tabs.map((tab) => ({
          key: tab.key,
          value: tab.key,
          label: tab.titleIntlId
            ? intl.formatMessage({ id: tab.titleIntlId })
            : tab.meta.frontmatter.title,
        })),
      ]}
      onChange={(key) => {
        if (key === 'default') {
          onChange();
        } else {
          onChange(tabs.find((t) => t.key === key));
        }
      }}
    />
  ) : null;
});

export default ContentTabs;
