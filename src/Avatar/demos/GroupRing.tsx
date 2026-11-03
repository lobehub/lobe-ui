import { Avatar } from '@lobehub/ui';

const items = [
  { avatar: 'Lin Wei', key: 'lin', ringColor: '#4f7cff', title: 'Lin Wei' },
  { avatar: 'Sora Tanaka', key: 'sora', ringColor: '#e8833a', title: 'Sora Tanaka' },
  { avatar: 'Maya Chen', key: 'maya', ringColor: '#2fa877', title: 'Maya Chen' },
  { avatar: 'Alex Rivera', key: 'alex', ringColor: '#d9539b', title: 'Alex Rivera' },
  { avatar: 'Jun Kim', key: 'jun', title: 'Jun Kim' },
];

export default () => <Avatar.Group items={items} max={3} shape="circle" size={32} />;
