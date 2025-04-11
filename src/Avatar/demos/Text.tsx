import { Avatar } from '@lobehub/ui';
import { Center } from 'react-layout-kit';

export default () => {
  return (
    <Center gap={16} horizontal wrap={'wrap'}>
      <Avatar avatar={'Canis'} />
      <Avatar avatar={'Minor'} />
      <Avatar avatar={'Lobe'} />
      <Avatar avatar={'A'} />
      <Avatar avatar={'x'} />
    </Center>
  );
};
