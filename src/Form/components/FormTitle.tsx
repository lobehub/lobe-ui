'use client';

import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Tag from '@/Tag';

import { useTitleStyles as useStyles } from '../style';
import type { FormTitleProps } from '../type';

const FormTitle = memo<FormTitleProps>(
  ({ tag, title, desc, avatar, classNames, styles: customStyles, ...rest }) => {
    const { cx, styles } = useStyles();

    return (
      <Flexbox align={`center`} gap={8} horizontal {...rest}>
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
  },
);

FormTitle.displayName = 'FormTitle';

export default FormTitle;
