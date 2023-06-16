import { useDebounceEffect } from 'ahooks';
import {
  useLocale,
  useLocation,
  useNavData,
  useRouteMeta,
  useSidebarData,
  useSiteData,
  useTabMeta,
} from 'dumi';
import isEqual from 'fast-deep-equal';
import React, { type DependencyList, type EffectCallback, useEffect } from 'react';

import { SiteStore, useSiteStore } from '@/store/useSiteStore';

const isBrowser = typeof window !== 'undefined';

const SSRInit: Record<string, boolean> = {};

const useReact18xUpdater = (effect: EffectCallback, deps?: DependencyList) => {
  useEffect(() => {
    (React as any).startTransition(() => {
      effect();
    });
  }, deps);
};
const useLegacyUpdater = (effect: EffectCallback, deps?: DependencyList) => {
  useDebounceEffect(
    () => {
      effect();
    },
    deps,
    { maxWait: 96, wait: 32 },
  );
};
const useUpdater =
  typeof (React as any).startTransition === 'function' ? useReact18xUpdater : useLegacyUpdater;

const useSyncState = <T extends keyof SiteStore>(
  key: T,
  value: SiteStore[T],
  updateMethod?: (key: T, value: SiteStore[T]) => void,
) => {
  const updater = updateMethod
    ? updateMethod
    : (key: T, value: SiteStore[T]) => useSiteStore.setState({ [key]: value });

  // 如果是 Node 环境，直接更新一次 store
  // 但是为了避免多次更新 store，所以加一个标记
  if (!isBrowser && !SSRInit[key]) {
    updater(key, value);
    SSRInit[key] = true;
  }

  useUpdater(() => {
    updater(key, value);
  }, [value]);
};

const homeNav = {
  activePath: '/',
  link: '/',
  title: 'Home',
};

export const StoreUpdater = () => {
  const siteData = useSiteData();
  const sidebar = useSidebarData();
  const routeMeta = useRouteMeta();
  const tabMeta = useTabMeta();
  const navData = useNavData();
  const location = useLocation();
  const locale = useLocale();

  useSyncState('siteData', siteData, () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { setLoading, ...data } = siteData;
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      siteData: { setLoading: _, ...previousData },
    } = useSiteStore.getState();

    if (isEqual(data, previousData)) return;

    useSiteStore.setState({ siteData });
  });

  useSyncState('sidebar', sidebar);
  useSyncState('routeMeta', routeMeta);
  useSyncState('location', location);
  useSyncState('tabMeta', tabMeta);
  useSyncState('locale', locale);

  useSyncState('navData', navData, () => {
    const data = siteData.themeConfig.hideHomeNav ? navData : [homeNav, ...navData];

    useSiteStore.setState({ navData: data });
  });

  return false;
};
