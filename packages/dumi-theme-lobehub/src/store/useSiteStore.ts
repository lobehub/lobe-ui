import { AtomAsset } from 'dumi-assets-types';
import {
  ILocale,
  ILocalesConfig,
  INavItem,
  IPreviewerProps,
  IRouteMeta,
  ISidebarGroup,
  IThemeConfig,
} from 'dumi/dist/client/theme-api/types';
import { PICKED_PKG_FIELDS } from 'dumi/dist/constants';
import type { Location } from 'history';
import { ComponentType } from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type NavData = (INavItem & { children?: INavItem[] | undefined })[];

export interface ISiteData {
  components: Record<string, AtomAsset>;
  demos: Record<
    string,
    {
      asset: IPreviewerProps['asset'];
      component: ComponentType;
      routeId: string;
    }
  >;
  entryExports: Record<string, any>;

  loading: boolean;
  locales: ILocalesConfig;
  pkg: Partial<Record<keyof typeof PICKED_PKG_FIELDS, any>>;
  setLoading: (status: boolean) => void;
  themeConfig: IThemeConfig;
}

export interface SiteStore {
  locale: ILocale;
  location: Location;
  navData: NavData;
  routeMeta: IRouteMeta;
  sidebar?: ISidebarGroup[];
  siteData: ISiteData;
  tabMeta?: NonNullable<IRouteMeta['tabs']>[0]['meta'];
}

const initialState: SiteStore = {
  locale: { id: 'zh-CN', name: '中文', suffix: '' },
  location: {
    hash: '',
    key: '',
    pathname: '',
    search: '',
    state: '',
  },
  navData: [],

  routeMeta: {
    // @ts-ignore
    frontmatter: {},

    tabs: undefined,

    texts: [],

    toc: [],
  },

  sidebar: [],

  siteData: {
    components: {},

    demos: {},

    entryExports: {},

    loading: true,

    locales: [],

    pkg: {},
    // @ts-ignore
    setLoading: undefined,
    // @ts-ignore
    themeConfig: {},
  },
};

export const useSiteStore = create<SiteStore>()(
  devtools(
    () => ({
      ...initialState,
    }),
    { name: '@' },
  ),
);
