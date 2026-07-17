import { getDocsConfig } from '../../src/config';

const repositoryRoot = process.cwd();
const config = getDocsConfig(repositoryRoot);

export const siteMetadata = {
  description: config.description,
  giscus: config.themeConfig?.giscus,
  name: config.title,
  openGraphImage: config.themeConfig?.metadata?.openGraph?.image ?? '',
  origin: config.siteUrl,
  plausible: config.themeConfig?.analytics?.plausible,
} as const;
