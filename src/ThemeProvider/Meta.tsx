'use client';

import { type FC, useCallback } from 'react';

import { useCdnFn } from '@/ConfigProvider';

import type { MetaProps } from './type';

const Meta: FC<MetaProps> = ({
  title = 'LobeHub',
  description = 'Empowering your AI dreams with LobeHub',
  withManifest,
}) => {
  const genCdnUrl = useCdnFn();
  const genAssets = useCallback(
    (path: string) =>
      genCdnUrl({
        path,
        pkg: '@lobehub/assets-favicons',
        version: 'latest',
      }),
    [],
  );
  return (
    <>
      <link href={genAssets('assets/favicon.ico')} rel="shortcut icon" />
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
      <meta
        content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover, user-scalable=no"
        name="viewport"
      />
      <meta content={title} name="apple-mobile-web-app-title" />
      <meta content={title} name="application-name" />
      <meta content={description} name="description" />
      <meta content="#000000" name="msapplication-TileColor" />
      <meta content="#fff" media="(prefers-color-scheme: light)" name="theme-color" />
      <meta content="#000" media="(prefers-color-scheme: dark)" name="theme-color" />
      <meta content="yes" name="apple-mobile-web-app-capable" />
      <meta content={title} name="apple-mobile-web-app-title" />
      <meta content="black-translucent" name="apple-mobile-web-app-status-bar-style" />
      {withManifest && <link href={genAssets('assets/site.webmanifest')} rel="manifest" />}
    </>
  );
};

export default Meta;
