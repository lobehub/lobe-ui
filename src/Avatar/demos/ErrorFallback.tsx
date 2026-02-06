import { Avatar } from '@lobehub/ui';

import { Center } from '@/Flex';

export default () => {
  return (
    <Center horizontal gap={16} wrap={'wrap'}>
      <Avatar avatar="https://example.com/broken-image.png" title="John Doe" />
      <Avatar avatar="https://invalid-url-test.local/404.jpg" title="Alice" />
      <Avatar avatar="https://avatars.githubusercontent.com/u/28616219" title="Valid Image" />
    </Center>
  );
};
