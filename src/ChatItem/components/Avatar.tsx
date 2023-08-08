import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import A from '@/Avatar';

import { useStyles } from '../style';
import type { ChatItemProps } from '../type';
import Loading from './Loading';

export interface AvatarProps {
  addon?: ChatItemProps['avatarAddon'];
  avatar: ChatItemProps['avatar'];
  loading?: ChatItemProps['loading'];
  onClick?: ChatItemProps['onAvatarClick'];
  placement?: ChatItemProps['placement'];
  size?: number;
}

const Avatar = memo<AvatarProps>(({ loading, avatar, placement, addon, onClick, size = 40 }) => {
  const { styles } = useStyles({ avatarSize: size });
  const avatarContent = (
    <div className={styles.avatarContainer}>
      <A
        animation={loading}
        avatar={avatar.avatar}
        background={avatar.backgroundColor}
        onClick={onClick}
        size={size}
        title={avatar.title}
      />
      <Loading loading={loading} placement={placement} />
    </div>
  );

  if (!addon) return avatarContent;
  return (
    <Flexbox align={'center'} className={styles.avatarGroupContainer} gap={8}>
      {avatarContent}
      {addon}
    </Flexbox>
  );
});

export default Avatar;
