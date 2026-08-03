import { ActionIcon, Image } from '@lobehub/ui';
import { ExternalLink } from 'lucide-react';

const src = 'https://picsum.photos/id/1025/1200/800';

export default () => {
  return (
    <Image
      alt={'Pug wrapped in a blanket'}
      src={src}
      width={320}
      preview={{
        toolbarAddon: (
          <ActionIcon
            icon={ExternalLink}
            title={'Open original'}
            onClick={() => window.open(src, '_blank', 'noopener')}
          />
        ),
      }}
    />
  );
};
