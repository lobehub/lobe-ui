'use client';

import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import SkeletonAvatar from './SkeletonAvatar';
import SkeletonParagraph from './SkeletonParagraph';
import SkeletonTitle from './SkeletonTitle';
import { useStyles } from './style';
import type { SkeletonProps } from './type';

const Skeleton = memo<SkeletonProps>(
  ({
    active,
    avatar = false,
    title = true,
    paragraph = true,
    className,
    classNames,
    styles: customStyles,
    style,
    width,
    height,
    gap = 16,
    ...rest
  }) => {
    const { cx, styles } = useStyles();
    const showAvatar = Boolean(avatar);
    const showTitle = Boolean(title);
    const showParagraph = Boolean(paragraph);
    const avatarProps = typeof avatar === 'object' ? avatar : undefined;
    const titleProps = typeof title === 'object' ? title : undefined;
    const paragraphProps = typeof paragraph === 'object' ? paragraph : undefined;
    const rootStyle = {
      ...style,
      ...customStyles?.root,
      ...(width !== undefined ? { width } : {}),
      ...(height !== undefined ? { height } : {}),
    };

    const avatarActive = avatarProps?.active ?? active;
    const titleActive = titleProps?.active ?? active;
    const paragraphActive = paragraphProps?.active ?? active;

    return (
      <Flexbox
        align={showParagraph ? 'flex-start' : 'center'}
        className={cx(className, classNames?.root)}
        gap={gap}
        horizontal
        style={rootStyle}
        width={'100%'}
        {...rest}
      >
        {showAvatar && (
          <SkeletonAvatar
            {...avatarProps}
            active={avatarActive}
            className={cx(styles.avatar, classNames?.avatar, avatarProps?.className)}
            style={{
              ...avatarProps?.style,
              ...customStyles?.avatar,
            }}
          />
        )}
        <Flexbox gap={gap} width={'100%'}>
          {showTitle && (
            <SkeletonTitle
              {...titleProps}
              active={titleActive}
              className={cx(classNames?.title, titleProps?.className)}
              style={{
                ...titleProps?.style,
                ...customStyles?.title,
              }}
            />
          )}
          {showParagraph && (
            <SkeletonParagraph
              {...paragraphProps}
              active={paragraphActive}
              className={cx(classNames?.paragraph, paragraphProps?.className)}
              style={{
                ...paragraphProps?.style,
                ...customStyles?.paragraph,
              }}
            />
          )}
        </Flexbox>
      </Flexbox>
    );
  },
);

Skeleton.displayName = 'Skeleton';

export default Skeleton;
