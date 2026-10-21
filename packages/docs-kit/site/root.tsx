import './styles/global.css';
// Demo frames are prerendered, so their CSS must be linked from the root route, not a lazy chunk.
import './components/Demo/Demo.css';
import 'virtual:lobedocs/ui-style.css';

import { createHash } from 'node:crypto';

import { getThemeCss } from '@lobehub/ui';
import * as stylex from '@stylexjs/stylex';
import { type ReactNode, useEffect } from 'react';
import type { LinksFunction } from 'react-router';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteLoaderData } from 'react-router';
import siteConfig from 'virtual:lobedocs/site-config';
import { loadStylexRuntime, stylexLinks } from 'virtual:lobedocs/stylex';

import { SiteProviders } from './app/providers/SiteProviders';
import { ThemeBootstrap } from './app/providers/ThemeBootstrap';
import { styles } from './styles/globalStyles';

const DEFAULT_FAVICONS: Record<string, string> = {
  appleTouchIcon: '/apple-touch-icon.png',
  icon: '/favicon.ico',
  icon16: '/favicon-16x16.png',
  icon32: '/favicon-32x32.png',
};

export function loader() {
  const version = createHash('sha256').update(getThemeCss()).digest('hex').slice(0, 16);
  return { themeStylesheetHref: `/theme-vars.css?v=${version}` };
}

export const links: LinksFunction = () => {
  const favicons = { ...DEFAULT_FAVICONS, ...siteConfig.favicons };

  return [
    { href: favicons.icon, rel: 'icon', sizes: 'any' },
    { href: favicons.icon16, rel: 'icon', sizes: '16x16', type: 'image/png' },
    { href: favicons.icon32, rel: 'icon', sizes: '32x32', type: 'image/png' },
    { href: favicons.appleTouchIcon, rel: 'apple-touch-icon', sizes: '180x180' },
    ...stylexLinks,
  ];
};

export function Layout({ children }: { children: ReactNode }) {
  const data = useRouteLoaderData<typeof loader>('root');

  useEffect(() => {
    void loadStylexRuntime();
  }, []);

  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <style>{'@layer docs-reset, docs-prose, lobe-base, lobe-popup, lobe-ui;'}</style>
        <ThemeBootstrap prefersColor={siteConfig.themeConfig?.prefersColor} />
        <Meta />
        <link href={data?.themeStylesheetHref ?? '/theme-vars.css'} rel="stylesheet" />
        <Links />
      </head>
      <body>
        <SiteProviders>{children}</SiteProviders>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  return (
    <main {...stylex.props(styles.error)} id="docs-content">
      <h1 {...stylex.props(styles.errorTitle)}>Site unavailable</h1>
      <p {...stylex.props(styles.errorText)}>The requested page could not be rendered.</p>
    </main>
  );
}

export default function Root() {
  return <Outlet />;
}
