import { Image, type ImagePreviewOptions, Text } from '@lobehub/ui';

import { Flexbox } from '@/Flex';

const MODEST = 'https://picsum.photos/id/1067/1600/1067';
const HUGE = 'https://picsum.photos/id/1024/4000/2667';

const samples: { caption: string; preview?: ImagePreviewOptions; src: string }[] = [
  { caption: '1600 × 1067 — auto opens it at 100%', src: MODEST },
  { caption: '4000 × 2667 — auto falls back to fitted', src: HUGE },
  {
    caption: '1600 × 1067 — fit forces fitted',
    preview: { defaultZoom: 'fit' },
    src: MODEST,
  },
  {
    caption: '4000 × 2667 — actual forces 100%',
    preview: { defaultZoom: 'actual' },
    src: HUGE,
  },
];

export default () => {
  return (
    <Flexbox horizontal gap={16} wrap={'wrap'}>
      {samples.map(({ caption, preview, src }) => (
        <Flexbox gap={8} key={caption} style={{ width: 180 }}>
          <Image alt={caption} height={120} preview={preview ?? true} src={src} width={180} />
          <Text type={'secondary'}>{caption}</Text>
        </Flexbox>
      ))}
    </Flexbox>
  );
};
