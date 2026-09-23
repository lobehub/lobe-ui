import type { MetaDescriptor } from 'react-router';
import siteConfig from 'virtual:lobedocs/site-config';

import type { OverviewMatch } from '../../content/sectionOverview';

export function overviewMeta(
  { category, section }: OverviewMatch,
  pathname: string,
): MetaDescriptor[] {
  const heading = category ? `${category.title} - ${section.title}` : section.title;
  const title = `${heading} - ${siteConfig.title}`;
  const description = `Browse ${heading} documentation in ${siteConfig.title}.`;
  const canonicalUrl = new URL(pathname.replace(/\/+$/, ''), siteConfig.siteUrl).href;

  return [
    { title },
    { content: description, name: 'description' },
    { href: canonicalUrl, rel: 'canonical', tagName: 'link' },
    { content: 'website', property: 'og:type' },
    { content: siteConfig.title, property: 'og:site_name' },
    { content: title, property: 'og:title' },
    { content: description, property: 'og:description' },
    { content: canonicalUrl, property: 'og:url' },
  ];
}
