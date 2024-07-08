import { createStyles } from 'antd-style';
import { ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Tag from '@/Tag';
import { type DivProps } from '@/types';

export const useStyles = createStyles(({ css, token, prefixCls }) => ({
  formTitle: css`
    position: relative;
    text-align: start;

    > div {
      font-weight: 500;
      line-height: 1;
    }

    > small {
      display: block;

      line-height: 1.44;
      color: ${token.colorTextDescription};
      word-wrap: break-word;
      white-space: pre-wrap;
    }

    .${prefixCls}-tag {
      font-family: ${token.fontFamilyCode};
    }
  `,
}));

export interface FormTitleProps extends DivProps {
  avatar?: ReactNode;
  desc?: ReactNode;
  tag?: string;
  title: string;
}

const FormTitle = memo<FormTitleProps>(({ className, tag, title, desc, avatar }) => {
  const { cx, styles } = useStyles();
  const titleNode = (
    <Flexbox className={cx(styles.formTitle, className)}>
      <Flexbox align={'center'} direction={'horizontal'} gap={8}>
        {title}
        {tag && <Tag>{tag}</Tag>}
      </Flexbox>
      {desc && (
        <small
          style={{
            marginBottom: 2,
            marginTop: 6,
          }}
        >
          {desc}
        </small>
      )}
    </Flexbox>
  );

  if (avatar) {
    return (
      <Flexbox align={`center`} gap={8} horizontal>
        {avatar}
        {titleNode}
      </Flexbox>
    );
  }
  return titleNode;
});

export default FormTitle;
