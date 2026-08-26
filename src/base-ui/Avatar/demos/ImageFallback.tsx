import { Flexbox } from '@lobehub/ui';
import { Avatar } from '@lobehub/ui/base-ui';

export default () => (
  <Flexbox horizontal gap={16} padding={16}>
    <Avatar
      avatar="https://registry.npmmirror.com/@lobehub/static-favicon/latest/files/assets/favicon.ico"
      shape="circle"
      size={48}
    />
    <Avatar avatar="/this-image-does-not-exist.png" size={48} title="LB" />
  </Flexbox>
);
