'use client';

import { ElementType, ReactNode, createContext, memo, useContext } from 'react';

import { CDN, CdnApi, genCdnUrl } from '@/utils/genCdnUrl';

export interface Config {
  aAs?: ElementType;
  customCdnFn?: CdnFn;
  imgAs?: ElementType;
  imgUnoptimized?: boolean;
  proxy?: CDN | 'custom';
  // customJsdelivrFn?: JsdelivrFn;
  // jsdelivrProxy?: JsdelivrCDN | 'custom';
}

export const ConfigContext = createContext<Config | null>(null);

const ConfigProvider = memo<{ children: ReactNode; config: Config }>(({ children, config }) => {
  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
});

// useCdnFn
export type CdnFn = ({ pkg, version, path }: CdnApi) => string;

const cdnFallback: CdnFn = ({ pkg, version, path }) =>
  genCdnUrl({ path, pkg, proxy: 'aliyun', version });

export const useCdnFn = (): CdnFn => {
  const config = useContext(ConfigContext);
  if (!config) return cdnFallback;
  if (config?.proxy !== 'custom')
    return ({ pkg, version, path }) =>
      genCdnUrl({ path, pkg, proxy: config.proxy as any, version });
  return config?.customCdnFn || cdnFallback;
};

// useJsdelivrFn
// export type JsdelivrFn = ({ repo, path }: JsdelivrApi) => string;
//
// const JsdelivrFallback: JsdelivrFn = ({ repo, path }) =>
//   genJsdelivrUrl({ path, proxy: 'lobehub', repo });
//
// export const useJsdelivrFn = (): JsdelivrFn => {
//   const config = useContext(ConfigContext);
//   if (!config) return JsdelivrFallback;
//   if (config?.proxy !== 'custom')
//     return ({ repo, path }) => genJsdelivrUrl({ path, proxy: config.proxy as any, repo });
//   return config?.customJsdelivrFn || JsdelivrFallback;
// };
//

export default ConfigProvider;
