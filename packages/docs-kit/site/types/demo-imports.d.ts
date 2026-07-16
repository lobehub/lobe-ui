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
