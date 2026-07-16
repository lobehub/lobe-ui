declare module '*?demo' {
  const demo: import('./demo').DemoModule;

  export default demo;
}

declare module 'virtual:lobedocs/compatibility' {
  const compatibility: import('../compiler/types').DocumentationInventory;

  export default compatibility;
}

declare module 'virtual:lobedocs/site-config' {
  const siteConfig: import('../../src/config').ClientSiteConfig;

  export default siteConfig;
}
