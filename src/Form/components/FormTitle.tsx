'use client';

import clsx from 'clsx';
import { type FC } from 'react';

import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';
import Tag from '@/Tag';

import { useFormClasses } from '../stableContext';
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
  const formClasses = useFormClasses();
  return (
    <Flexbox
      horizontal
      align={'center'}
      gap={8}
      {...rest}
      className={clsx(formClasses('title'), rest.className)}
    >
      {avatar}
      <Flexbox
        gap={8}
        {...styleProps(
          styles.content,
          clsx(formClasses('title-content'), classNames?.content),
          customStyles?.content,
        )}
      >
        <Flexbox
          horizontal
          align={'center'}
          gap={8}
          {...styleProps(
            styles.title,
            clsx(formClasses('title-text'), classNames?.title),
            customStyles?.title,
          )}
        >
          {title}
          {tag && (
            <Tag
              className={clsx(formClasses('title-tag'), classNames?.tag)}
              style={customStyles?.tag}
              {...tagProps}
            >
              {tag}
            </Tag>
          )}
        </Flexbox>
        {desc && (
          <small
            {...styleProps(
              styles.desc,
              clsx(formClasses('title-desc'), classNames?.desc),
              customStyles?.desc,
            )}
          >
            {desc}
          </small>
        )}
      </Flexbox>
    </Flexbox>
  );
};

FormTitle.displayName = 'FormTitle';

export default FormTitle;
