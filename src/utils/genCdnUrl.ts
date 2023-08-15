const UNPKG_API = 'https://unpkg.com';
const ALIYUN_API = 'https://registry.npmmirror.com';

export type CDN = 'aliyun' | 'unpkg';
interface CdnApi {
  path: string;
  pkg: string;
  proxy?: CDN;
  version: string;
}

export const genCdnUrl = ({ pkg, version, path, proxy }: CdnApi) => {
  const api = proxy === 'unpkg' ? UNPKG_API : ALIYUN_API;
  return `${api.replaceAll(/^\//g, '')}/${pkg}/${version}/files/${path.replaceAll(/^\//g, '')}`;
};
