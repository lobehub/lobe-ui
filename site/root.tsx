import type { ReactNode } from 'react';
import type { LinksFunction } from 'react-router';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import SiteProviders from './app/providers/SiteProviders';
import ThemeBootstrap from './app/providers/ThemeBootstrap';
import { styles } from './styles/globalStyles';

const FONT_REGISTRY_ORIGIN = 'https://registry.npmmirror.com';
const GEIST_FONT_STYLESHEET = `${FONT_REGISTRY_ORIGIN}/@lobehub/webfont-geist/1.0.0/files/css/index.css`;
const GEIST_MONO_FONT_STYLESHEET = `${FONT_REGISTRY_ORIGIN}/@lobehub/webfont-geist-mono/1.0.0/files/css/index.css`;

export const links: LinksFunction = () => [
  { crossOrigin: 'anonymous', href: FONT_REGISTRY_ORIGIN, rel: 'preconnect' },
  { href: '/favicon.ico', rel: 'icon', sizes: 'any' },
  { href: '/favicon-16x16.png', rel: 'icon', sizes: '16x16', type: 'image/png' },
  { href: '/favicon-32x32.png', rel: 'icon', sizes: '32x32', type: 'image/png' },
  { href: '/apple-touch-icon.png', rel: 'apple-touch-icon', sizes: '180x180' },
  { href: '/antd.css', rel: 'stylesheet' },
  { href: GEIST_FONT_STYLESHEET, rel: 'stylesheet' },
  { href: GEIST_MONO_FONT_STYLESHEET, rel: 'stylesheet' },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <ThemeBootstrap />
        <Meta />
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
    <main className={styles.error} id="docs-content">
      <h1>Site unavailable</h1>
      <p>The requested page could not be rendered.</p>
    </main>
  );
}

export default function Root() {
  return <Outlet />;
}
