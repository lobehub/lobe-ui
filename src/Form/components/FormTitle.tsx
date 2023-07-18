import { Tag } from 'antd';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { DivProps } from '@/types';

import { useStyles } from './style';

export interface FormTitleProps extends DivProps {
  desc?: string;
  tag?: string;
  title: string;
}

const FormTitle = memo<FormTitleProps>(({ className, tag, title, desc }) => {
  const { cx, styles } = useStyles();
  return (
    <div className={cx(styles.formTitle, className)}>
      <Flexbox align={'center'} direction={'horizontal'} gap={8}>
        {title}
        {tag && <Tag>{tag}</Tag>}
      </Flexbox>
      {desc && <small>{desc}</small>}
    </div>
  );
});

export default FormTitle;
