import { Button, Skeleton } from '@lobehub/ui';
import { Flexbox } from 'react-layout-kit';

export default () => (
  <Flexbox align="flex-start" gap={16}>
    <Button type="primary">Button</Button>
    <Skeleton.Button />
    <Button size="small" type="primary">
      Button
    </Button>
    <Skeleton.Button size="small" />
    <Button size="large" type="primary">
      Button
    </Button>
    <Skeleton.Button size="large" />
    <Button shape="round" type="primary">
      Button
    </Button>
    <Skeleton.Button shape="round" />
    <Button shape="circle" type="primary">
      B
    </Button>
    <Skeleton.Button shape="circle" />
    <Button block type="primary">
      Button
    </Button>
    <Skeleton.Button block />
  </Flexbox>
);
