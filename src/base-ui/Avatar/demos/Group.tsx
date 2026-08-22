import { Avatar } from '@lobehub/ui/base-ui';

const items = [
  { avatar: 'Lo', key: 'lobe' },
  { avatar: 'Ch', key: 'chat' },
  { avatar: 'Ai', key: 'ai' },
  { avatar: 'Ag', key: 'agent' },
  { avatar: 'Ui', key: 'ui' },
];

export default () => <Avatar.Group items={items} max={3} shape="circle" size={44} />;
