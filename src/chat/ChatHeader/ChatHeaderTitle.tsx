import { createStyles } from 'antd-style';
import { ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    position: relative;
    overflow: hidden;
    flex: 1;
    max-width: 100%;
  `,
  desc: css`
    overflow: hidden;

    width: 100%;

    font-size: 12px;
    line-height: 1;
    color: ${token.colorTextTertiary};
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  tag: css`
    flex: none;
    align-items: baseline;
  `,
  title: css`
    overflow: hidden;

    font-size: 16px;
    font-weight: bold;
    line-height: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  titleContainer: css`
    flex: 1;
    line-height: 1;
  `,
  titleWithDesc: css`
    overflow: hidden;
    font-weight: bold;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
}));

export interface ChatHeaderTitleProps {
  desc?: string | ReactNode;
  tag?: ReactNode;
  title: string | ReactNode;
}

const ChatHeaderTitle = memo<ChatHeaderTitleProps>(({ title, desc, tag }) => {
  const { styles } = useStyles();

  const tagContent = tag && (
    <Flexbox align={'center'} className={styles.tag} horizontal>
      {tag}
    </Flexbox>
  );

  if (desc)
    return (
      <Flexbox className={styles.container} gap={4}>
        <Flexbox align={'center'} className={styles.titleContainer} gap={8} horizontal>
          <div className={styles.titleWithDesc}>{title}</div>
          {tagContent}
        </Flexbox>
        <Flexbox align={'center'} className={styles.desc} horizontal>
          {desc}
        </Flexbox>
      </Flexbox>
    );
  return (
    <Flexbox align={'center'} className={styles.container} gap={8} horizontal>
      <div className={styles.title}>{title}</div>
      {tagContent}
    </Flexbox>
  );
});

export default ChatHeaderTitle;
