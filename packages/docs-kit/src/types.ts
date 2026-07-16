export interface DemoOptions {
  inline: boolean;
  isolated: boolean;
  layout: 'bare' | 'center' | 'default';
}

export interface DemoReference {
  document: string;
  legacyId: string;
  legacyRouteId: string;
  options: DemoOptions;
  pathname: string;
  source: string;
}

export interface DocumentRecord {
  category?: string;
  description?: string;
  legacyRouteId: string;
  pathname: string;
  section: string;
  source: string;
  title?: string;
}

export interface DocumentationInventory {
  demoReferences: DemoReference[];
  documents: DocumentRecord[];
}
