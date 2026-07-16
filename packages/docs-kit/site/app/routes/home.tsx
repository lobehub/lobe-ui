import type { MetaFunction } from 'react-router';
import HomePage from 'virtual:lobedocs/home-page';
import siteConfig from 'virtual:lobedocs/site-config';

import { styles } from '../../components/Home/homeStyle';
import { sectionLandingPathname } from '../../content/pageChrome';
import { contentManifest, findDocument } from '../content/registry';

export const meta: MetaFunction = () => {
  const document = findDocument('/');
  const title = document ? `${document.title} - ${siteConfig.title}` : siteConfig.title;
  const description = document?.description ?? siteConfig.description;
  const canonicalUrl = new URL('/', siteConfig.siteUrl).href;
  const openGraphImage = siteConfig.themeConfig?.metadata?.openGraph?.image ?? '';

  return [
    { title },
    { content: description, name: 'description' },
    { href: canonicalUrl, rel: 'canonical', tagName: 'link' },
    { content: 'website', property: 'og:type' },
    { content: siteConfig.title, property: 'og:site_name' },
    { content: title, property: 'og:title' },
    { content: description, property: 'og:description' },
    { content: canonicalUrl, property: 'og:url' },
    { content: openGraphImage, property: 'og:image' },
    { content: 'summary_large_image', name: 'twitter:card' },
  ];
};

export default function Home() {
  const document = findDocument('/');
  const description = document?.description ?? siteConfig.description;
  const firstSection = contentManifest.navigation[0];
  const getStartedPathname = firstSection ? sectionLandingPathname(firstSection) : '/changelog';

  return (
    <main className={styles.root} id="docs-content">
      <article data-pagefind-body className={styles.document}>
        <HomePage description={description} getStartedPathname={getStartedPathname} />
      </article>
    </main>
  );
}
