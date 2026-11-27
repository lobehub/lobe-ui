import { ImageGrid } from '@lobehub/ui';

import { images } from './data';

export default () => (
  <ImageGrid
    images={images.slice(0, 5).map(({ caption: _, ...image }) => image)}
    layout="bento"
    style={{ maxWidth: 560 }}
    variant="a2ui"
  />
);
