import { createStyles } from 'antd-style';
import { ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

const useStyles = createStyles(({ css, token }) => ({
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
  `,
  titleWithDesc: css`
    overflow: hidden;

    font-weight: bold;
    line-height: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
}));

export interface MobileNavBarTitleProps {
  desc?: string | ReactNode;
  tag?: ReactNode;
  title: string | ReactNode;
}

const MobileNavBarTitle = memo<MobileNavBarTitleProps>(({ title, desc, tag }) => {
  const { styles } = useStyles();
  if (desc)
    return (
      <Flexbox align={'center'} flex={1} gap={4} justify={'center'}>
        <Flexbox align={'center'} className={styles.titleContainer} gap={4} horizontal>
          <div className={styles.titleWithDesc}>{title}</div>
          {tag && (
            <Flexbox className={styles.tag} horizontal>
              {tag}
            </Flexbox>
          )}
        </Flexbox>
        <Flexbox align={'center'} horizontal>
          <div className={styles.desc}>{desc}</div>
        </Flexbox>
      </Flexbox>
    );
  return (
    <Flexbox align={'center'} flex={1} gap={4} horizontal justify={'center'}>
      <div className={styles.title}>{title}</div>
      <Flexbox className={styles.tag} horizontal>
        {tag}
      </Flexbox>
    </Flexbox>
  );
});

export default MobileNavBarTitle;
