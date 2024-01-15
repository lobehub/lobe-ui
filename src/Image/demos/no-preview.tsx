import { Image } from '@lobehub/ui';

const url =
  'https://cdn.discordapp.com/attachments/1174150905801736255/1196334838370816040/meng1011_cute_little_duckling_soft_fluffy_feathers_bright_eyes__19295cb6-11f9-49c9-a012-5e0bf76946d4.png?ex=65b740a4&is=65a4cba4&hm=ded84a6c8600b73135a9607e0ea4eca14e20eb4a566bf614e1f98450b75585be';

export default () => {
  return <Image preview={false} src={url} />;
};
