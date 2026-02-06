import { Avatar } from '@lobehub/ui';

import { Center } from '@/Flex';

export default () => {
  return (
    <Center horizontal gap={16} wrap={'wrap'}>
      <Avatar avatar={'Canis'} />
      <Avatar avatar={'Minor'} />
      <Avatar avatar={'Lobe'} />
      <Avatar avatar={'A'} />
      <Avatar avatar={'x'} />
    </Center>
  );
};
