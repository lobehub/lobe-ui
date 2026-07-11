import { Outlet } from 'react-router';

import Header from '../../components/Header/Header';
import { contentManifest } from '../content/registry';
import { useSiteTheme } from '../providers/SiteProviders';

export default function DocsRouteLayout() {
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

export function ErrorBoundary() {
  return (
    <main className="docs-error" id="docs-content">
      <h1>Documentation unavailable</h1>
      <p>The requested documentation could not be rendered.</p>
    </main>
  );
}
