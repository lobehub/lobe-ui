import { ActionIcon, Image } from '@lobehub/ui';
import { Trash } from 'lucide-react';

export default () => {
  return (
    <Image
      actions={<ActionIcon danger glass icon={Trash} variant={'filled'} />}
      src={
        'https://registry.npmmirror.com/@lobehub/fluent-emoji-3d/latest/files/assets/1f5bc-fe0f.webp'
      }
    />
  );
};
