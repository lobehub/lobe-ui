import { type CSSProperties, type FC, useMemo } from 'react';

import A from '@/Avatar';
import { Flexbox } from '@/Flex';

import { styles } from '../style';
import type { ChatItemProps } from '../type';
import Loading from './Loading';

export interface AvatarProps {
  addon?: ChatItemProps['avatarAddon'];
  alt?: string;
  avatar: ChatItemProps['avatar'];
  loading?: ChatItemProps['loading'];
  onClick?: ChatItemProps['onAvatarClick'];
  placement?: ChatItemProps['placement'];
  size?: number;
  style?: CSSProperties;
  unoptimized?: boolean;
}

const Avatar: FC<AvatarProps> = ({
  loading,
  avatar,
  placement,
  unoptimized,
  addon,
  onClick,
  size = 40,
  style,
  alt,
}) => {
  const cssVariables = useMemo<Record<string, string>>(
    () => ({
      '--chat-item-avatar-size': `${size}px`,
    }),
    [size],
  );

  const avatarContent = (
    <div className={styles.avatarContainer} style={{ ...cssVariables, ...style }}>
      <A
        alt={alt || avatar.title}
        animation={loading}
        avatar={avatar.avatar}
        background={avatar.backgroundColor}
        onClick={onClick}
        size={size}
        title={avatar.title}
        unoptimized={unoptimized}
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
};

export default Avatar;
