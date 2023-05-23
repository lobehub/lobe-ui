import { Avatar as A } from 'antd';
import { createStyles } from 'antd-style';
import { FC } from 'react';
import { Center } from 'react-layout-kit';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    cursor: pointer;

    > * {
      cursor: pointer;
    }
  `,
  border: css`
    border: 1px solid ${token.colorBorder};
  `,
}));

export interface AvatarProps {
  avatar?: string;
  title?: string;
  size?: number;
  shape?: 'circle' | 'square';
  background?: string;
}

const Avatar: FC<AvatarProps> = ({ avatar, title, size = 40, shape = 'circle', background }) => {
  const { styles, theme } = useStyles();

  const backgroundColor = background ?? theme.colorBgContainer;

  const isImage = avatar && ['/', 'http', 'data:'].some((i) => avatar.startsWith(i));

  return (
    <Center
      style={{
        width: size,
        height: size,
        borderRadius: shape === 'circle' ? '50%' : 6,
        backgroundColor,
        borderWidth: isImage ? 1 : 0,
      }}
      className={styles.container}
    >
      {!avatar ? (
        <A shape={shape} size={size}>
          {title?.slice(0, 2)}
        </A>
      ) : isImage ? (
        <A shape={shape} size={size} src={avatar} className={styles.border} />
      ) : (
        <Center
          className={styles.border}
          style={{
            width: size,
            height: size,
            fontSize: size / 2,
            borderRadius: shape === 'circle' ? '50%' : 6,
            backgroundColor,
          }}
        >
          {avatar}
        </Center>
      )}
    </Center>
  );
};

export default Avatar;
