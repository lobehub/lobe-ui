import type { ComponentType } from 'react';

export type DemoAppearance = 'dark' | 'light';

export type DemoLayout = 'bare' | 'center' | 'default';

export interface DemoModule {
  editable: boolean;
  id: string;
  legacyIds: string[];
  load: () => Promise<ComponentType>;
  loadScope: () => Promise<Record<string, unknown>>;
  routeId: string;
  source: string;
  sourcePath: string;
}

export interface DemoProps {
  description?: string;
  editable?: boolean;
  height?: number | string;
  isolated?: boolean;
  layout?: DemoLayout;
  of: DemoModule;
  title?: string;
}
