import { Image, ImageGallery } from '@lobehub/ui';
import { Flexbox } from 'react-layout-kit';

export default () => {
  return (
    <Flexbox gap={8} horizontal>
      <ImageGallery>
        <Image
          src={
            'https://registry.npmmirror.com/@lobehub/fluent-emoji-3d/latest/files/assets/1f5bc-fe0f.webp'
          }
        />
        <Image
          src={
            'https://registry.npmmirror.com/@lobehub/fluent-emoji-3d/latest/files/assets/1f379.webp'
          }
        />
      </ImageGallery>
    </Flexbox>
  );
};
