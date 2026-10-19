'use client';

import './style.css';

import clsx from 'clsx';

import { styleProps } from '@/styles/stylex/props';
import Tabs from '@/Tabs';

import { dashboardPageTabsClasses } from './stable';
import { styles } from './style';
import type { PageTabsProps } from './type';

const classNames = {
  list: styleProps(styles.list, dashboardPageTabsClasses('list')).className,
  panel: dashboardPageTabsClasses('panel'),
  tab: styleProps(styles.tab, dashboardPageTabsClasses('tab')).className,
};

function PageTabs<Value extends string>({
  className,
  label,
  onChange,
  tabs,
  value,
}: PageTabsProps<Value>) {
  return (
    <div
      aria-label={label}
      role="navigation"
      {...styleProps(styles.root, clsx(dashboardPageTabsClasses(), className))}
    >
      <Tabs
        activeKey={value}
        className={dashboardPageTabsClasses('tabs')}
        classNames={classNames}
        items={tabs.map((tab) => ({
          children: tab.content,
          key: tab.value,
          label: (
            <>
              {tab.label}
              {tab.count !== undefined ? (
                <span {...styleProps(styles.count, dashboardPageTabsClasses('count'))}>
                  {tab.count}
                </span>
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
