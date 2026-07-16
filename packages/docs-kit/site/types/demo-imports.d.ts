declare module '*?demo' {
  const demo: import('./demo').DemoModule;

  export default demo;
}

declare module 'virtual:lobedocs/compatibility' {
  const compatibility: import('../compiler/types').DocumentationInventory;

  export default compatibility;
}

declare module 'virtual:lobedocs/site-config' {
  const siteConfig: {
    description: string;
    favicons?: Record<string, string>;
    navSections: Record<string, string>;
    siteUrl: string;
    themeConfig?: import('../../src/config').DocsThemeConfig;
    title: string;
  };

  export default siteConfig;
}

declare module 'virtual:lobedocs/document-modules' {
  type DocumentMetadata = import('./content').DocumentManifestEntry;
  type MDXModule = import('./content').MDXModule;

  export const componentMetadata: Record<string, DocumentMetadata>;
  export const publicMetadata: Record<string, DocumentMetadata>;
  export const publicModuleLoaders: Record<string, () => Promise<MDXModule>>;
  export const componentModuleLoaders: Record<string, () => Promise<MDXModule>>;
}
