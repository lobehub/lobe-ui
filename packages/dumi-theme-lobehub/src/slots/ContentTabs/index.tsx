import { Tabs } from 'antd';
import { useIntl, useRouteMeta } from 'dumi';
import { memo } from 'react';

import { useStyles } from './style';

type IContentTabs = ReturnType<typeof useRouteMeta>['tabs'];

export interface ContentTabsProps {
  onChange: (tab?: NonNullable<IContentTabs>[0]) => void;
  tabKey: string | undefined;
  tabs: IContentTabs;
}

const ContentTabs = memo<ContentTabsProps>(({ tabs, tabKey: key, onChange }) => {
  const intl = useIntl();
  const { styles } = useStyles();
  // TODO: tab.Extra & tab.Action render

  return tabs && tabs?.length > 0 ? (
    <Tabs
      activeKey={key || 'default'}
      className={styles.cls}
      data-page-tabs
      items={[
        { key: 'default', label: '文档', value: 'default' },
        ...tabs.map((tab) => ({
          key: tab.key,
          label: tab.titleIntlId
            ? intl.formatMessage({ id: tab.titleIntlId })
            : tab.meta.frontmatter.title,
          value: tab.key,
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
  ) : undefined;
});

export default ContentTabs;
