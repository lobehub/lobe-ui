import { Flexbox } from '@lobehub/ui';
import { Avatar } from '@lobehub/ui/base-ui';

export default () => (
  <Flexbox horizontal gap={16} padding={16} wrap={'wrap'}>
    <Avatar avatar="Lobe" size={48} />
    <Avatar avatar="Chat" shape="circle" size={48} />
    <Avatar avatar="AI" background="#1677ff" size={40} />
    <Avatar avatar="Tiny" size={20} />
    <Avatar shadow avatar="Full Text" shape="circle" size={64} variant="outlined" />
  </Flexbox>
);
