import { Skeleton, Text } from '@lobehub/ui';
import { Flexbox } from 'react-layout-kit';

export default () => (
  <Flexbox gap={16}>
    <Flexbox>
      <Text>Paragraph</Text>
      <Text>Paragraph</Text>
      <Text>Paragraph</Text>
    </Flexbox>
    <Skeleton.Paragraph rows={3} />
    <Flexbox>
      <Text fontSize={12}>Paragraph</Text>
      <Text fontSize={12}>Paragraph</Text>
    </Flexbox>
    <Skeleton.Paragraph fontSize={12} rows={2} width={['100%', '80%']} />
    <Text>Paragraph</Text>
    <Skeleton.Paragraph rows={1} width={['80%']} />
  </Flexbox>
);
