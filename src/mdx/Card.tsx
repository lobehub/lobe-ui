'use client';

import { Tag, TagProps } from 'antd';
import { createStyles } from 'antd-style';
import { FC } from 'react';
import { Flexbox, type FlexboxProps } from 'react-layout-kit';

import A from '@/A';
import Icon, { type IconProps } from '@/Icon';
import Img from '@/Img';

const useStyles = createStyles(({ css, cx, token }) => {
  const icon = cx(css`
    margin-block: 0.1em;
    opacity: 0.5;
    transition: opacity 0.2s ${token.motionEaseInOut};
  `);

  return {
    card: css`
      --lobe-markdown-header-multiple: 0.2;
      --lobe-markdown-margin-multiple: 1;

      overflow: hidden;

      height: 100%;

      color: ${token.colorText};

      border-radius: calc(var(--lobe-markdown-border-radius) * 1px);
      box-shadow: 0 0 0 1px var(--lobe-markdown-border-color);

      transition: all 0.2s ${token.motionEaseInOut};

      h3,
      p {
        margin-block: 0;
      }

      p {
        color: ${token.colorTextDescription};
        transition: color 0.2s ${token.motionEaseInOut};
      }

      &:hover {
        background: ${token.colorFillQuaternary};
        box-shadow: 0 0 0 1px ${token.colorBorder};

        p {
          color: ${token.colorTextSecondary};
        }

        .${icon} {
          opacity: 1;
        }
      }
    `,
    content: css`
      width: 100%;
      padding: 1.4em;
    `,
    icon,
  };
});

export interface CardProps extends Omit<FlexboxProps, 'children'> {
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
  tagColor = 'success',
  icon,
  title,
  desc,
  href,
  iconProps,
  className,
  image,
  ...rest
}) => {
  const { cx, styles } = useStyles();

  return (
    <A href={href}>
      <Flexbox align={'flex-start'} className={cx(styles.card, className)} {...rest}>
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
          <Flexbox align={'flex-start'} className={styles.content} style={{ paddingBottom: 0 }}>
            <Tag
              bordered={false}
              color={tagColor}
              style={{ borderRadius: '1em', fontSize: '0.8em' }}
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
            <Icon className={styles.icon} icon={icon} size={{ fontSize: '1.5em' }} {...iconProps} />
          )}
          <Flexbox gap={'0.2em'}>
            <h3>{title}</h3>
            {desc && <p>{desc}</p>}
          </Flexbox>
        </Flexbox>
      </Flexbox>
    </A>
  );
};

export default Card;
