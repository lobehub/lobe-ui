import { Image } from '@lobehub/ui';

import { Flexbox } from '@/Flex';

const photos = [
  { alt: 'Canyon river', src: 'https://picsum.photos/id/1016/1200/800' },
  { alt: 'Foggy mountains', src: 'https://picsum.photos/id/1018/1200/800' },
  { alt: 'Waterfall', src: 'https://picsum.photos/id/1039/1200/800' },
  { alt: 'Coastline', src: 'https://picsum.photos/id/1043/1200/800' },
];

export default () => {
  return (
    <Image.PreviewGroup>
      <Flexbox horizontal gap={8} wrap={'wrap'}>
        {photos.map(({ alt, src }) => (
          <Image alt={alt} height={80} key={src} src={src} width={120} />
        ))}
      </Flexbox>
    </Image.PreviewGroup>
  );
};
