import { siteMetadata } from '../../content/siteMetadata';

interface PlausibleProps {
  enabled?: boolean;
}

export default function Plausible({ enabled = import.meta.env.PROD }: PlausibleProps) {
  if (!enabled) return null;

  return (
    <script defer data-domain={siteMetadata.plausible.domain} src={siteMetadata.plausible.source} />
  );
}
