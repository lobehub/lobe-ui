'use client';

import { createStyles } from 'antd-style';
import { CSSProperties, ReactNode, forwardRef } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

import Tag, { type TagProps } from '@/Tag';

export const useStyles = createStyles(({ css, token }) => ({
  content: css`
    position: relative;
    text-align: start;
  `,

  desc: css`
    display: block;

    line-height: 1.44;
    color: ${token.colorTextDescription};
    word-wrap: break-word;
    white-space: pre-wrap;
  `,
  title: css`
    font-weight: 500;
    line-height: 1;
  `,
}));

export interface FormTitleProps extends Omit<FlexboxProps, 'title'> {
  avatar?: ReactNode;
  classNames?: {
    content?: string;
    desc?: string;
    tag?: string;
    title?: string;
  };
  desc?: ReactNode;
  styles?: {
    content?: CSSProperties;
    desc?: CSSProperties;
    tag?: CSSProperties;
    title?: CSSProperties;
  };
  tag?: string;
  tagProps?: Omit<TagProps, 'children'>;
  title: ReactNode;
}

const FormTitle = forwardRef<HTMLDivElement, FormTitleProps>(
  ({ tag, title, desc, avatar, classNames, styles: customStyles, ...rest }, ref) => {
    const { cx, styles } = useStyles();

    return (
      <Flexbox align={`center`} gap={8} horizontal ref={ref} {...rest}>
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
