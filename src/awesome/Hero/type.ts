import type { ElementType } from 'react';

export interface HeroAction {
  github?: boolean;
  link: string;
  openExternal?: boolean;
  text: string;
  type?: 'primary' | 'default';
}

export interface HeroProps {
  Link?: ElementType;
  actions?: HeroAction[];
  description?: string;
  title?: string;
}
