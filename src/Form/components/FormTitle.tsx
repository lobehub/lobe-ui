'use client';

import { type FC } from 'react';

import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';
import Tag from '@/Tag';

import { titleStyles as styles } from '../style';
import type { FormTitleProps } from '../type';

const FormTitle: FC<FormTitleProps> = ({
  tag,
  title,
  desc,
  avatar,
  classNames,
  styles: customStyles,
  tagProps,
  ...rest
}) => {
  return (
    <Flexbox horizontal align={'center'} gap={8} {...rest}>
      {avatar}
      <Flexbox gap={8} {...styleProps(styles.content, classNames?.content, customStyles?.content)}>
        <Flexbox
          horizontal
          align={'center'}
          gap={8}
          {...styleProps(styles.title, classNames?.title, customStyles?.title)}
        >
          {title}
          {tag && (
            <Tag className={classNames?.tag} style={customStyles?.tag} {...tagProps}>
              {tag}
            </Tag>
          )}
        </Flexbox>
        {desc && (
          <small {...styleProps(styles.desc, classNames?.desc, customStyles?.desc)}>{desc}</small>
        )}
      </Flexbox>
    </Flexbox>
  );
};

FormTitle.displayName = 'FormTitle';

export default FormTitle;
