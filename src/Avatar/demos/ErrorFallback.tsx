import { Avatar } from '@lobehub/ui';

import { Center } from '@/Flex';

export default () => {
  return (
    <Center gap={16} horizontal wrap={'wrap'}>
      <Avatar avatar="https://example.com/broken-image.png" title="John Doe" />
      <Avatar avatar="https://invalid-url-test.local/404.jpg" title="Alice" />
      <Avatar avatar="https://avatars.githubusercontent.com/u/28616219" title="Valid Image" />
    </Center>
  );
};
