'use client';

import { createStaticStyles, cx } from 'antd-style';
import { FC } from 'react';

import A from '@/A';
import Block, { type BlockProps } from '@/Block';
import { Flexbox } from '@/Flex';
import Icon, { type IconProps } from '@/Icon';
import Img from '@/Img';
import Tag, { type TagProps } from '@/Tag';

const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    card: css`
      --lobe-markdown-header-multiple: 0.2;
      --lobe-markdown-margin-multiple: 1;

      overflow: hidden;
      height: 100%;
      color: ${cssVar.colorText};

      h3,
      p {
        margin-block: 0 !important;
      }

      p {
        color: ${cssVar.colorTextDescription};
        transition: color 0.2s ${cssVar.motionEaseInOut};
      }

      &:hover {
        p {
          color: ${cssVar.colorTextSecondary};
        }

        .mdx-card-icon {
          opacity: 1;
        }
      }
    `,
    content: css`
      width: 100%;
      padding: 1.4em;
    `,
    icon: css`
      margin-block: 0.1em;
      opacity: 0.5;
      transition: opacity 0.2s ${cssVar.motionEaseInOut};
    `,
  };
});

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
        align={'flex-start'}
        className={cx(styles.card, className)}
        clickable
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
            className={styles.content}
            style={{ paddingBottom: '0.2em', paddingTop: '1.8em' }}
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
          align={desc ? 'flex-start' : 'center'}
          className={styles.content}
          gap={'0.75em'}
          horizontal
        >
          {!image && icon && (
            <Icon
              className={cx(styles.icon, 'mdx-card-icon')}
              icon={icon}
              size={{ size: '1.5em' }}
              {...iconProps}
            />
          )}
          <Flexbox gap={'0.2em'}>
            <h3>{title}</h3>
            {desc && <p>{desc}</p>}
          </Flexbox>
        </Flexbox>
      </Block>
    </A>
  );
};

Card.displayName = 'MdxCard';

export default Card;
