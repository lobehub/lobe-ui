const ELEM_API = 'https://npm.elemecdn.com';
const ALIYUN_API = 'https://registry.npmmirror.com';

interface EmojiApi {
  path: string;
  pkg: string;
  version?: string;
}
const genElemUrl = ({ pkg, version, path }: EmojiApi): string => {
  return `${ELEM_API}/${pkg}${version ? `@${version}` : ''}/${path}`;
};

const genAliyunUrl = ({ pkg, version, path }: EmojiApi): string => {
  return `${ALIYUN_API}/${pkg}${version ? `/${version}` : ''}/files/${path}`;
};

export const genEmojiUrl = (type: 'elem' | 'aliyun', config: EmojiApi) => {
  return type === 'elem' ? genElemUrl(config) : genAliyunUrl(config);
};
