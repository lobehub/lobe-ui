import { Image } from '@lobehub/ui';

export default () => {
  return (
    <Image
      alt="The Great Wave off Kanagawa"
      preview={{ maxScale: 16 }}
      src="https://upload.wikimedia.org/wikipedia/commons/0/0d/Great_Wave_off_Kanagawa2.jpg"
      width={320}
    />
  );
};
