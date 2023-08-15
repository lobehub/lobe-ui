import { memo, useCallback } from 'react';

import { genCdnUrl } from '@/utils/genCdnUrl';

export interface MetaProps {
  title?: string;
  withManifest?: boolean;
}

const Meta = memo<MetaProps>(({ title = 'LobeHub', withManifest }) => {
  const genAssets = useCallback(
    (path: string) =>
      genCdnUrl({
        path,
        pkg: '@lobehub/assets-favicons',
        version: '1.1.0',
      }),
    [],
  );
  return (
    <>
      <link
        href={genAssets('assets/apple-touch-icon.png')}
        rel="apple-touch-icon"
        sizes="180x180"
      />
      <link
        href={genAssets('assets/favicon-32x32.png')}
        rel="icon"
        sizes="32x32"
        type="image/png"
      />
      <link
        href={genAssets('assets/favicon-16x16.png')}
        rel="icon"
        sizes="16x16"
        type="image/png"
      />
      <link color="#000000" href={genAssets('assets/safari-pinned-tab.svg')} rel="mask-icon" />
      <meta content={title} name="apple-mobile-web-app-title" />
      <meta content={title} name="application-name" />
      <meta content="#000000" name="msapplication-TileColor" />
      <meta content="#000000" name="theme-color" />
      {withManifest && <link href={genAssets('assets/site.webmanifest')} rel="manifest" />}
    </>
  );
});

export default Meta;
