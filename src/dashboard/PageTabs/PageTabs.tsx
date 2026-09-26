'use client';

import Tabs from '@/base-ui/Tabs';

import { styles } from './style';
import type { PageTabsProps } from './type';

function PageTabs<Value extends string>({ label, onChange, tabs, value }: PageTabsProps<Value>) {
  return (
    <div aria-label={label} className={styles.root} role="navigation">
      <Tabs
        activeKey={value}
        classNames={{ list: styles.list, panel: styles.panel, tab: styles.tab }}
        items={tabs.map((tab) => ({
          children: tab.content,
          key: tab.value,
          label: (
            <>
              {tab.label}
              {tab.count !== undefined ? <span className={styles.count}>{tab.count}</span> : null}
            </>
          ),
        }))}
        onChange={(next) => {
          const tab = tabs.find((item) => item.value === next);
          if (tab) onChange(tab.value);
        }}
      />
    </div>
  );
}

PageTabs.displayName = 'PageTabs';

export default PageTabs;
