'use client';

import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import Tabs from '@/Tabs';

import { styles } from './style';
import type { PageTabsProps } from './type';

const classNames = {
  list: stylex.props(styles.list).className,
  tab: stylex.props(styles.tab).className,
};

const slotStyles = {
  list: { gap: cssVar.paddingXXS, padding: cssVar.paddingXXS },
  panel: { paddingBlockStart: 16 },
  tab: { gap: cssVar.paddingXS },
};

function PageTabs<Value extends string>({ label, onChange, tabs, value }: PageTabsProps<Value>) {
  return (
    <div aria-label={label} role="navigation" {...stylex.props(styles.root)}>
      <Tabs
        activeKey={value}
        classNames={classNames}
        styles={slotStyles}
        items={tabs.map((tab) => ({
          children: tab.content,
          key: tab.value,
          label: (
            <>
              {tab.label}
              {tab.count !== undefined ? (
                <span {...stylex.props(styles.count)}>{tab.count}</span>
              ) : null}
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
