import { Image } from '@lobehub/ui';

export default () => {
  return (
    <Image
      alt="mountain lake"
      preview={{ src: 'https://picsum.photos/id/1015/1920/1280' }}
      src="https://picsum.photos/id/1015/480/320"
      width={320}
    />
  );
};
