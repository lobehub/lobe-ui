'use client';

import { cx } from 'antd-style';
import { type FC } from 'react';

import { Flexbox } from '@/Flex';
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
  ...rest
}) => {
  return (
    <Flexbox horizontal align={`center`} gap={8} {...rest}>
      {avatar}
      <Flexbox
        className={cx(styles.content, classNames?.content)}
        gap={8}
        style={customStyles?.content}
      >
        <Flexbox
          align={'center'}
          className={cx(styles.title, classNames?.title)}
          direction={'horizontal'}
          gap={8}
          style={customStyles?.title}
        >
          {title}
          {tag && (
            <Tag className={classNames?.tag} style={customStyles?.tag}>
              {tag}
            </Tag>
          )}
        </Flexbox>
        {desc && (
          <small className={cx(styles.desc, classNames?.desc)} style={customStyles?.desc}>
            {desc}
          </small>
        )}
      </Flexbox>
    </Flexbox>
  );
};

FormTitle.displayName = 'FormTitle';

export default FormTitle;
