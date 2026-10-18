'use client';

import './style.css';

import clsx from 'clsx';
import type { FC } from 'react';

import A from '@/A';
import Block, { type BlockProps } from '@/Block';
import { Flexbox } from '@/Flex';
import Icon, { type IconProps } from '@/Icon';
import Img from '@/Img';
import { styleProps } from '@/styles/stylex/props';
import Tag, { type TagProps } from '@/Tag';

import { cardMarker } from './marker.stylex';
import { mdxCardsClasses } from './stable';
import { styles } from './style';

export interface CardProps extends Omit<BlockProps, 'children'> {
  desc?: string;
  href?: string;
  icon?: IconProps['icon'];
  iconProps?: Omit<IconProps, 'icon'>;
  image?: string;
  tag?: string;
  tagColor?: TagProps['color'];
  title: string;
}

const Card: FC<CardProps> = ({
  tag,
  tagColor = 'blue',
  icon,
  title,
  desc,
  href,
  iconProps,
  className,
  image,
  variant = 'filled',
  ...rest
}) => {
  return (
    <A className={mdxCardsClasses('link')} href={href}>
      <Block
        clickable
        align={'flex-start'}
        height={'100%'}
        {...styleProps(
          [styles.card, cardMarker],
          clsx(mdxCardsClasses('card'), 'lobe-mdx-card', className),
        )}
        variant={variant}
        {...rest}
      >
        {image && (
          <Img
            alt={title}
            height={100}
            src={image}
            width={250}
            {...styleProps(styles.image, mdxCardsClasses('image'))}
          />
        )}
        {tag && (
          <Flexbox
            align={'flex-start'}
            padding={'1.4em'}
            width={'100%'}
            {...styleProps(styles.tagRow, mdxCardsClasses('tag-row'))}
          >
            <Tag className={mdxCardsClasses('tag')} color={tagColor}>
              {tag}
            </Tag>
          </Flexbox>
        )}
        <Flexbox
          horizontal
          align={desc ? 'flex-start' : 'center'}
          className={mdxCardsClasses('header')}
          gap={'0.75em'}
          padding={'1.4em'}
          width={'100%'}
        >
          {!image && icon && (
            <Icon
              {...styleProps(styles.icon, clsx(mdxCardsClasses('icon'), 'mdx-card-icon'))}
              icon={icon}
              size={{ size: '1.5em' }}
              {...iconProps}
            />
          )}
          <Flexbox gap={'0.2em'}>
            <h3 className={mdxCardsClasses('title')}>{title}</h3>
            {desc && <p {...styleProps(styles.desc, mdxCardsClasses('desc'))}>{desc}</p>}
          </Flexbox>
        </Flexbox>
      </Block>
    </A>
  );
};

Card.displayName = 'MdxCard';

export default Card;
