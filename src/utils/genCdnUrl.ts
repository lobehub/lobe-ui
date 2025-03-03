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

// export type JsdelivrCDN = 'jsdelivr' | 'lobehub';
//
// const JSDELIVR_API = 'https://fastly.jsdelivr.net';
// const LOBEHUB_API = 'https://jsdelivr.lobeobjects.space';
//
// export interface JsdelivrApi {
//   path: string;
//   proxy?: JsdelivrCDN;
//   repo: string;
// }
//
// export const genJsdelivrUrl = ({ path, proxy, repo }: JsdelivrApi): string => {
//   switch (proxy) {
//     case 'jsdelivr': {
//       return urlJoin(JSDELIVR_API, 'gh', repo, path);
//     }
//     default: {
//       return urlJoin(LOBEHUB_API, 'gh', repo, path);
//     }
//   }
// };


export { UNPKG_API, ALIYUN_API };