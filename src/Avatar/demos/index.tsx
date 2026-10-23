import { Avatar, Flexbox } from '@lobehub/ui';

export default () => (
  <Flexbox horizontal align="center" gap={16} padding={16} wrap={'wrap'}>
    <Avatar avatar="Lobe" size={48} />
    <Avatar avatar="Chat" shape="circle" size={48} />
    <Avatar size={40} title="Arvin Xu" />
    <Avatar avatar="Tiny" size={20} />
    <Avatar shadow avatar="Full Text" shape="circle" size={64} variant="outlined" />
    <Avatar avatar="AI" background="#1677ff" fallbackVariant="text" size={40} />
    <Avatar avatar="Lobe" fallbackVariant="text" shape="circle" size={48} />
  </Flexbox>
);
