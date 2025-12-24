'use client';

import {
  ElementType,
  ReactNode,
  createContext,
  memo,
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { MotionComponent, type MotionComponentType } from '@/MotionProvider';
import type {
  I18nContextValue,
  TranslationKey,
  TranslationResourcesInput,
  TranslationResourcesMap,
} from '@/i18n/types';
import { CDN, CdnApi, genCdnUrl } from '@/utils/genCdnUrl';

export interface Config {
  aAs?: ElementType;
  customCdnFn?: CdnFn;
  imgAs?: ElementType;
  imgUnoptimized?: boolean;
  proxy?: CDN | 'custom';
}

export const ConfigContext = createContext<Config | null>(null);

// Internal i18n context
const I18nContextInternal = createContext<I18nContextValue>({
  locale: 'en',
  t: (key: TranslationKey) => key,
});

export interface ConfigProviderProps {
  children: ReactNode;
  config?: Config;
  // i18n props - flattened at top level
  locale?: string;
  motion: MotionComponentType;
  resources?: TranslationResourcesInput;
}

const isThenable = (value: unknown): value is Promise<TranslationResourcesMap> =>
  typeof (value as { then?: unknown })?.then === 'function';

const ConfigProvider = memo<ConfigProviderProps>(
  ({ children, config, locale, resources, motion }) => {
    const fallbackLocale = locale ?? 'en';
    const [resolvedResources, setResolvedResources] = useState<TranslationResourcesMap | undefined>(
      () => (resources && !isThenable(resources) ? resources : undefined),
    );
    const [resolvedLocale, setResolvedLocale] = useState(fallbackLocale);
    const latestRequestId = useRef(0);

    useEffect(() => {
      const requestId = ++latestRequestId.current;

      if (!resources) {
        setResolvedResources(undefined);
        setResolvedLocale(fallbackLocale);
        return;
      }

      if (isThenable(resources)) {
        const targetLocale = fallbackLocale;
        resources
          .then((nextResources) => {
            if (latestRequestId.current !== requestId) return;
            setResolvedResources(nextResources);
            setResolvedLocale(targetLocale);
          })
          .catch(() => {
            if (latestRequestId.current !== requestId) return;
          });
        return;
      }

      setResolvedResources(resources);
      setResolvedLocale(fallbackLocale);
    }, [fallbackLocale, resources]);

    const currentResources = isThenable(resources) ? resolvedResources : resources;
    const currentLocale = isThenable(resources) ? resolvedLocale : fallbackLocale;

    const i18nValue = useMemo((): I18nContextValue => {
      const resourceList = Array.isArray(currentResources)
        ? currentResources
        : currentResources
          ? Object.values(currentResources)
          : [];
      const mergedResources = Object.assign({}, ...resourceList);
      const t = (key: TranslationKey): string => mergedResources[key] || key;
      return { locale: currentLocale, t };
    }, [currentLocale, currentResources]);

    return (
      <I18nContextInternal value={i18nValue}>
        <ConfigContext value={config ?? null}>
          <MotionComponent value={motion}>{children}</MotionComponent>
        </ConfigContext>
      </I18nContextInternal>
    );
  },
);

// useCdnFn
export type CdnFn = ({ pkg, version, path }: CdnApi) => string;

const cdnFallback: CdnFn = ({ pkg, version, path }) =>
  genCdnUrl({ path, pkg, proxy: 'aliyun', version });

export const useCdnFn = (): CdnFn => {
  const config = use(ConfigContext);
  if (!config) return cdnFallback;
  if (config?.proxy !== 'custom')
    return ({ pkg, version, path }) =>
      genCdnUrl({ path, pkg, proxy: config.proxy as any, version });
  return config?.customCdnFn || cdnFallback;
};

// useI18n hook
export const useI18n = () => use(I18nContextInternal);

// Export I18nContext for external reference
export { I18nContextInternal as I18nContext };

export default ConfigProvider;
