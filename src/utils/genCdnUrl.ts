import urlJoin from 'url-join';

const UNPKG_API = 'https://unpkg.com';
const ALIYUN_API = 'https://registry.npmmirror.com';

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
      return urlJoin(UNPKG_API, `${pkg}@${version}`, path);
    }
    default: {
      return urlJoin(ALIYUN_API, pkg, version, 'files', path);
    }
  }
};

export { ALIYUN_API, UNPKG_API };
