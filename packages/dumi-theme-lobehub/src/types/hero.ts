import type { FeatureItem, HeroAction } from '@lobehub/ui';

export type ImageContainerType = 'light' | 'primary' | 'soon';

export interface IHero {
  actions: HeroAction[];
  description?: string;
  features?: FeatureItem[];
  title?: string;
}
