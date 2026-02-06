import type { ElementType } from 'react';

export interface HeroAction {
  github?: boolean;
  link: string;
  openExternal?: boolean;
  text: string;
  type?: 'primary' | 'default';
}

export interface HeroProps {
  actions?: HeroAction[];
  description?: string;
  Link?: ElementType;
  title?: string;
}
