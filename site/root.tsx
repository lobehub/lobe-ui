import type { ReactNode } from 'react';
import type { LinksFunction } from 'react-router';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import globalStyles from './styles/global.css?url';
import tokenStyles from './styles/tokens.css?url';

export const links: LinksFunction = () => [
  { href: tokenStyles, rel: 'stylesheet' },
  { href: globalStyles, rel: 'stylesheet' },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  return (
    <main>
      <h1>Documentation unavailable</h1>
      <p>The requested documentation could not be rendered.</p>
    </main>
  );
}

export default function Root() {
  return <Outlet />;
}
