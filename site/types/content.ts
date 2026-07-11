import type { ComponentType } from 'react';

export type DocumentStatus = 'stable' | 'beta' | 'experimental' | 'deprecated';

export interface ContentFrontmatter {
  category?: string;
  description: string;
  order?: number;
  route?: string;
  since?: string;
  status?: DocumentStatus;
  title: string;
}

export interface DocumentManifestEntry extends ContentFrontmatter {
  pathname: string;
  source: string;
}

export interface NavigationSection {
  documents: DocumentManifestEntry[];
  title: string;
}

export interface ContentManifest {
  documents: DocumentManifestEntry[];
  navigation: NavigationSection[];
}

export interface MDXModule {
  default: ComponentType;
  frontmatter: ContentFrontmatter;
}
