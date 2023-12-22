import { ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Tag from '@/Tag';
import { DivProps } from '@/types';

import { useStyles } from './style';

export interface FormTitleProps extends DivProps {
  avatar?: ReactNode;
  desc?: ReactNode;
  tag?: string;
  title: string;
}

const FormTitle = memo<FormTitleProps>(({ className, tag, title, desc, avatar }) => {
  const { cx, styles } = useStyles();
  const titleNode = (
    <Flexbox className={cx(styles.formTitle, className)} gap={6}>
      <Flexbox align={'center'} direction={'horizontal'} gap={8}>
        {title}
        {tag && <Tag>{tag}</Tag>}
      </Flexbox>
      {desc && <small>{desc}</small>}
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
