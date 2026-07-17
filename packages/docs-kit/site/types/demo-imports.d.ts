declare module '*?demo' {
  const demo: import('./demo').DemoModule;

  export default demo;
}

declare module '@lobehub/ui/es/styles/theme/antdTheme' {
  export const createLobeAntdTheme: (options: {
    appearance: 'dark' | 'light';
    neutralColor?: string;
    primaryColor?: string;
  }) => import('antd').ThemeConfig;
}

declare module 'virtual:lobedocs/compatibility' {
  const compatibility: import('../compiler/types').DocumentationInventory;

  export default compatibility;
}

declare module 'virtual:lobedocs/site-config' {
  const siteConfig: import('../../src/config').ClientSiteConfig;

  export default siteConfig;
}

declare module 'virtual:lobedocs/home-page' {
  const HomePage: import('react').ComponentType<{
    description: string;
    getStartedPathname: string;
  }>;

  export default HomePage;
}

declare module 'virtual:lobedocs/document-modules' {
  type DocumentMetadata = import('./content').DocumentManifestEntry;
  type MDXModule = import('./content').MDXModule;

  export const componentMetadata: Record<string, DocumentMetadata>;
  export const publicMetadata: Record<string, DocumentMetadata>;
  export const publicModuleLoaders: Record<string, () => Promise<MDXModule>>;
  export const componentModuleLoaders: Record<string, () => Promise<MDXModule>>;
}
