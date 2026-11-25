import { Favicon, Flexbox, Text } from '@lobehub/ui';

const sites = [
  'https://github.com/lobehub/lobe-ui',
  'https://www.wikipedia.org/',
  'https://developer.mozilla.org/en-US/docs/Web',
  'not a url',
];

export default () => (
  <Flexbox gap={12} padding={24}>
    {sites.map((url) => (
      <Flexbox horizontal align="center" gap={8} key={url}>
        <Favicon url={url} />
        <Text fontSize={13}>{url}</Text>
      </Flexbox>
    ))}
    <Flexbox horizontal align="center" gap={8}>
      <Favicon host="lobehub.com" shape="circle" size={24} />
      <Favicon host="github.com" shape="circle" size={24} />
      <Favicon host="vercel.com" shape="circle" size={24} />
    </Flexbox>
  </Flexbox>
);
