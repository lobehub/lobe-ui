import type { ReactNode } from 'react';

import type { ProTableLocale } from './type';

export type ProTableLocaleResolved = Required<Omit<ProTableLocale, 'alertSelected'>> & {
  alertSelected: (count: number) => ReactNode;
};

export const PRO_TABLE_LOCALE_EN_US: ProTableLocaleResolved = {
  alertClear: 'Clear',
  alertSelected: (count) => `${count} selected`,
  collapse: 'Collapse',
  columnSetting: 'Column settings',
  columnSettingReset: 'Reset',
  columnSettingTitle: 'Columns',
  copy: 'Copy',
  density: 'Density',
  densityLarge: 'Large',
  densityMedium: 'Medium',
  densitySmall: 'Compact',
  expand: 'Expand',
  fixedEnd: 'Pin to end',
  fixedEndTitle: 'Pinned to end',
  fixedStart: 'Pin to start',
  fixedStartTitle: 'Pinned to start',
  fullScreen: 'Full screen',
  moveDown: 'Move down',
  moveUp: 'Move up',
  noFixed: 'Unpin',
  reload: 'Reload',
  reset: 'Reset',
  search: 'Search',
  searchPlaceholder: 'Please enter',
  selectPlaceholder: 'Please select',
  unfixedTitle: 'Not pinned',
};

export const PRO_TABLE_LOCALE_ZH_CN: ProTableLocaleResolved = {
  alertClear: '取消选择',
  alertSelected: (count) => `已选择 ${count} 项`,
  collapse: '收起',
  columnSetting: '列设置',
  columnSettingReset: '重置',
  columnSettingTitle: '列展示',
  copy: '复制',
  density: '密度',
  densityLarge: '宽松',
  densityMedium: '中等',
  densitySmall: '紧凑',
  expand: '展开',
  fixedEnd: '固定在列尾',
  fixedEndTitle: '固定在右侧',
  fixedStart: '固定在列首',
  fixedStartTitle: '固定在左侧',
  fullScreen: '全屏',
  moveDown: '下移',
  moveUp: '上移',
  noFixed: '取消固定',
  reload: '刷新',
  reset: '重置',
  search: '查询',
  searchPlaceholder: '请输入',
  selectPlaceholder: '请选择',
  unfixedTitle: '不固定',
};

export const PRO_TABLE_LOCALES = {
  'en-US': PRO_TABLE_LOCALE_EN_US,
  'zh-CN': PRO_TABLE_LOCALE_ZH_CN,
} as const;

export const resolveProTableLocale = (language?: string): ProTableLocaleResolved =>
  language && /^zh/i.test(language) ? PRO_TABLE_LOCALE_ZH_CN : PRO_TABLE_LOCALE_EN_US;
