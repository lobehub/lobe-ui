'use client';

import './style.css';

import * as stylex from '@stylexjs/stylex';
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
    <A href={href}>
      <Block
        clickable
        align={'flex-start'}
        height={'100%'}
        {...styleProps([styles.card, cardMarker], clsx('lobe-mdx-card', className))}
        variant={variant}
        {...rest}
      >
        {image && (
          <Img
            alt={title}
            height={100}
            src={image}
            style={{ height: 'auto', width: '100%' }}
            width={250}
          />
        )}
        {tag && (
          <Flexbox
            align={'flex-start'}
            padding={'1.4em'}
            style={{ paddingBottom: '0.2em', paddingTop: '1.8em' }}
            width={'100%'}
          >
            <Tag
              color={tagColor}
              style={{
                borderRadius: '1em',
                fontSize: '0.8em',
                fontWeight: 500,
                paddingBlock: '0.1em',
                paddingInline: '0.6em',
              }}
            >
              {tag}
            </Tag>
          </Flexbox>
        )}
        <Flexbox
          horizontal
          align={desc ? 'flex-start' : 'center'}
          gap={'0.75em'}
          padding={'1.4em'}
          width={'100%'}
        >
          {!image && icon && (
            <Icon
              {...styleProps(styles.icon, 'mdx-card-icon')}
              icon={icon}
              size={{ size: '1.5em' }}
              {...iconProps}
            />
          )}
          <Flexbox gap={'0.2em'}>
            <h3>{title}</h3>
            {desc && <p {...stylex.props(styles.desc)}>{desc}</p>}
          </Flexbox>
        </Flexbox>
      </Block>
    </A>
  );
};

Card.displayName = 'MdxCard';

export default Card;
