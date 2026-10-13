import type { TableProps, TableRef, TableScrollToConfig } from '../type';
import type { StickyConfig } from './viewTypes';

export const toTableRef = (
  element: HTMLDivElement,
  scrollTo: (config: TableScrollToConfig) => void,
): TableRef => {
  const extra = { nativeElement: element, scrollTo };
  return new Proxy(element, {
    get(target, prop) {
      if (prop in extra) return extra[prop as keyof typeof extra];
      const value = Reflect.get(target, prop, target);
      return typeof value === 'function' ? value.bind(target) : value;
    },
  }) as TableRef;
};

export const resolveSticky = (sticky: TableProps<unknown>['sticky']): StickyConfig => {
  const config = typeof sticky === 'object' ? sticky : {};
  const fallback = typeof window === 'undefined' ? (undefined as any) : window;
  return {
    container: config.getContainer?.() || fallback,
    isSticky: Boolean(sticky),
    offsetHeader: config.offsetHeader ?? 0,
    offsetScroll: config.offsetScroll ?? 0,
    offsetSummary: config.offsetSummary ?? 0,
  };
};
