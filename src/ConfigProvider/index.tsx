import { ElementType, ReactNode, createContext, memo, useContext } from 'react';

import { CDN, CdnApi, genCdnUrl } from '@/utils/genCdnUrl';

type CdnFn = ({ pkg, version, path }: CdnApi) => string;
export interface Config {
  customCdnFn?: CdnFn;
  imgAs?: ElementType;
  proxy?: CDN | 'custom';
}

export const ConfigContext = createContext<Config | null>(null);

const ConfigProvider = memo<{ children: ReactNode; config: Config }>(({ children, config }) => {
  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
});

const fallback: CdnFn = ({ pkg, version, path }) =>
  genCdnUrl({ path, pkg, proxy: 'aliyun', version });
export const useCdnFn = (): CdnFn => {
  const config = useContext(ConfigContext);

  if (!config) return fallback;
  if (config?.proxy !== 'custom')
    return ({ pkg, version, path }) =>
      genCdnUrl({ path, pkg, proxy: config.proxy as any, version });
  return config?.customCdnFn || fallback;
};

export default ConfigProvider;
