import { createSitemap, listSitemapPathnames } from '../../compiler/seo/createSitemap';
import { contentManifest } from '../content/registry';

export function loader() {
  const sitemap = createSitemap(
    listSitemapPathnames(contentManifest.documents, contentManifest.navigation),
  );

  return new Response(sitemap, {
    headers: {
      'Cache-Control': 'public, max-age=300',
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
