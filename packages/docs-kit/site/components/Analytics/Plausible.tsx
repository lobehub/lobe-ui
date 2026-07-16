import siteConfig from 'virtual:lobedocs/site-config';

interface PlausibleProps {
  enabled?: boolean;
}

export function Plausible({ enabled = import.meta.env.PROD }: PlausibleProps) {
  if (!enabled) return null;

  const plausible = siteConfig.themeConfig?.analytics?.plausible;
  if (!plausible) return null;

  return <script defer data-domain={plausible.domain} src={plausible.source} />;
}
