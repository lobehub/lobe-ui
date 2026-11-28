import { ImageGallery } from '@lobehub/ui';

import { images } from './data';

export default () => <ImageGallery columns={3} images={images} style={{ maxWidth: 560 }} />;
