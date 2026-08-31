import { Skeleton, Text } from '@lobehub/ui/base-ui';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox gap={16}>
    <Text fontSize={20} weight={'bold'}>
      Title
    </Text>
    <Skeleton.Text fontSize={20} width={'40%'} />
    <Flexbox>
      <Text>Paragraph</Text>
      <Text>Paragraph</Text>
      <Text>Paragraph</Text>
    </Flexbox>
    <Skeleton.Text rows={3} />
    <Skeleton.Text rows={3} width={['100%', '80%', '60%']} />
  </Flexbox>
);
