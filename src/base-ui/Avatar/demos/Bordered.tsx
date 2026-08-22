import { Flexbox } from '@lobehub/ui';
import { Avatar } from '@lobehub/ui/base-ui';

export default () => (
  <Flexbox horizontal gap={16} padding={16}>
    <Avatar bordered avatar="B1" size={48} />
    <Avatar bordered avatar="B2" borderedColor="#1677ff" shape="circle" size={48} />
    <Avatar bordered loading avatar="B3" size={48} />
  </Flexbox>
);
