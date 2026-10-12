const UNPKG_API = 'https://unpkg.com';
const ALIYUN_API = 'https://registry.npmmirror.com';

const joinUrl = (base: string, ...segments: string[]): string => {
  const joined = [
    base.replace(/\/+$/, ''),
    ...segments.map((segment) => segment.replaceAll(/^\/+|\/+$/g, '')),
  ]
    .filter(Boolean)
    .join('/');
  return segments.at(-1)?.endsWith('/') ? `${joined}/` : joined;
};

export type CDN = 'aliyun' | 'unpkg';
export interface CdnApi {
  path: string;
  pkg: string;
  proxy?: CDN;
  version?: string;
}

export const genCdnUrl = ({ pkg, version = 'latest', path, proxy }: CdnApi): string => {
  switch (proxy) {
    case 'unpkg': {
      return joinUrl(UNPKG_API, `${pkg}@${version}`, path);
    }
    default: {
      return joinUrl(ALIYUN_API, pkg, version, 'files', path);
    }
  }
};

export { ALIYUN_API, UNPKG_API };
