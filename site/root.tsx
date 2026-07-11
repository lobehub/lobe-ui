import type { ReactNode } from 'react';
import type { LinksFunction } from 'react-router';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import { contentManifest } from './app/content/registry';
import SiteProviders, { useSiteTheme } from './app/providers/SiteProviders';
import ThemeBootstrap from './app/providers/ThemeBootstrap';
import Header from './components/Header/Header';
import globalStyles from './styles/global.css?url';
import tokenStyles from './styles/tokens.css?url';

const FONT_REGISTRY_ORIGIN = 'https://registry.npmmirror.com';
const GEIST_FONT_STYLESHEET = `${FONT_REGISTRY_ORIGIN}/@lobehub/webfont-geist/1.0.0/files/css/index.css`;
const GEIST_MONO_FONT_STYLESHEET = `${FONT_REGISTRY_ORIGIN}/@lobehub/webfont-geist-mono/1.0.0/files/css/index.css`;

export const links: LinksFunction = () => [
  { crossOrigin: 'anonymous', href: FONT_REGISTRY_ORIGIN, rel: 'preconnect' },
  { href: GEIST_FONT_STYLESHEET, rel: 'stylesheet' },
  { href: GEIST_MONO_FONT_STYLESHEET, rel: 'stylesheet' },
  { href: tokenStyles, rel: 'stylesheet' },
  { href: globalStyles, rel: 'stylesheet' },
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
    <main className="docs-error" id="docs-content">
      <h1>Documentation unavailable</h1>
      <p>The requested documentation could not be rendered.</p>
    </main>
  );
}

export default function Root() {
  const { preference, setPreference } = useSiteTheme();

  return (
    <>
      <a className="docs-skip-link" href="#docs-content">
        Skip to documentation
      </a>
      <Header
        navigation={contentManifest.navigation}
        preference={preference}
        onPreferenceChange={setPreference}
      />
      <Outlet />
    </>
  );
}
