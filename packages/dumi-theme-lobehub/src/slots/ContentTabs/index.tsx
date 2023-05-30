import { Tabs } from 'antd';
import { useIntl, useRouteMeta } from 'dumi';
import { memo } from 'react';

import { useStyles } from './style';

type IContentTabs = ReturnType<typeof useRouteMeta>['tabs'];

export interface IContentTabsProps {
  onChange: (tab?: NonNullable<IContentTabs>[0]) => void;
  tabKey: string | null;
  tabs: IContentTabs;
}

const ContentTabs = memo<IContentTabsProps>(({ tabs, tabKey: key, onChange }) => {
  const intl = useIntl();
  const { styles } = useStyles();
  // TODO: tab.Extra & tab.Action render

  return !!tabs && Boolean(tabs?.length) ? (
    <Tabs
      activeKey={key || 'default'}
      className={styles.cls}
      data-page-tabs
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
