import { Flexbox } from '@lobehub/ui';
import { Avatar } from '@lobehub/ui/base-ui';

export default () => (
  <Flexbox horizontal gap={16} padding={16}>
    <Avatar avatar="😀" size={48} />
    <Avatar animation avatar="🎉" size={48} />
    <Avatar avatar="🚀" background="#fde3e3" size={64} />
    <Avatar avatar="🔥" shape="circle" size={32} />
  </Flexbox>
);
