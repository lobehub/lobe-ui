'use client';

import { Empty as AntEmpty } from 'antd';
import { cssVar, useThemeMode } from 'antd-style';
import { type FC } from 'react';

import Block from '@/Block';
import { Flexbox } from '@/Flex';
import FluentEmoji from '@/FluentEmoji';
import Icon from '@/Icon';
import Text from '@/Text';

import type { EmptyProps } from './type';

const Empty: FC<EmptyProps> = ({
  title,
  description,
  icon,
  image,
  emoji,
  imageSize = 48,
  iconColor,
  action,
  children,
  imageProps,
  align,
  actionProps,
  type = 'default',
  titleProps,
  descriptionProps,
  ...rest
}) => {
  const { isDarkMode } = useThemeMode();
  const isPage = type === 'page';
  const alignValue = align || (isPage ? 'flex-start' : 'center');
  const isCenter = alignValue === 'center';

  const fallbackImage = AntEmpty.PRESENTED_IMAGE_SIMPLE;
  const hasImage = image || emoji || icon;
  const cover = hasImage ? (
    image ? (
      image
    ) : (
      <Block
        align={'center'}
        flex={'none'}
        height={imageSize}
        justify="center"
        variant={'outlined'}
        width={imageSize}
        {...imageProps}
        style={{
          marginBottom: 4,
          ...imageProps?.style,
        }}
      >
        {icon && (
          <Icon
            color={
              iconColor || (isDarkMode ? cssVar.colorTextQuaternary : cssVar.colorTextSecondary)
            }
            icon={icon}
            size={imageSize * 0.66}
          />
        )}
        {emoji && <FluentEmoji emoji={emoji} size={imageSize * 0.75} type={'anim'} />}
      </Block>
    )
  ) : (
    fallbackImage
  );

  return (
    <Flexbox align={alignValue} gap={8} padding={16} {...rest}>
      {cover}
      <Flexbox align={alignValue} gap={isPage ? 4 : 1}>
        {title && (
          <Text
            align={isCenter ? 'center' : undefined}
            fontSize={isPage ? 24 : 16}
            weight={'bold'}
            {...titleProps}
          >
            {title}
          </Text>
        )}
        {description && (
          <Text
            align={isCenter ? 'center' : undefined}
            color={isPage ? cssVar.colorTextSecondary : cssVar.colorTextDescription}
            fontSize={isPage ? 16 : 14}
            {...descriptionProps}
          >
            {description}
          </Text>
        )}
      </Flexbox>
      {children}
      {action && (
        <Flexbox gap={4} {...actionProps}>
          {action}
        </Flexbox>
      )}
    </Flexbox>
  );
};

Empty.displayName = 'Empty';

export default Empty;
