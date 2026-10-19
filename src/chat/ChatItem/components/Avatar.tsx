import { type CSSProperties, type FC, useMemo } from 'react';

import A from '@/Avatar';
import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';

import { chatChatItemClasses } from '../stable';
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
  withTitle?: boolean;
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
  withTitle,
}) => {
  const cssVariables = useMemo<Record<string, string>>(
    () => ({
      '--chat-item-avatar-size': `${size}px`,
    }),
    [size],
  );

  const avatarContent = (
    <div
      {...styleProps(
        [styles.avatarContainer, withTitle ? styles.avatarWithTitle : styles.avatarOffset],
        chatChatItemClasses('avatar'),
        { ...cssVariables, ...style },
      )}
    >
      <A
        alt={alt || avatar.title}
        animation={loading}
        avatar={avatar.avatar}
        background={avatar.backgroundColor}
        size={size}
        title={avatar.title}
        unoptimized={unoptimized}
        onClick={onClick}
      />
      <Loading loading={loading} placement={placement} />
    </div>
  );

  if (!addon) return avatarContent;
  return (
    <Flexbox
      align={'center'}
      className={chatChatItemClasses('avatar-group')}
      gap={8}
      width={'var(--chat-item-avatar-size, 40px)'}
    >
      {avatarContent}
      {addon}
    </Flexbox>
  );
};

export default Avatar;
