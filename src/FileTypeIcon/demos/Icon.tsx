import { FileTypeIcon, Icon } from '@lobehub/ui';
import { createStyles, useTheme } from 'antd-style';
import { ArrowUpIcon, PlusIcon } from 'lucide-react';
import { Center, Flexbox } from 'react-layout-kit';

const useStyles = createStyles(({ css, token }) => {
  return {
    card: css`
      position: relative;

      overflow: hidden;

      width: 150px;
      height: 100px;
      border-radius: ${token.borderRadiusLG}px;

      font-weight: 500;
      text-align: center;

      background: ${token.colorFillTertiary};
      box-shadow: 0 0 0 1px ${token.colorFillTertiary} inset;
    `,
    glow: css`
      position: absolute;
      inset-block-end: -12px;
      inset-inline-end: 0;

      width: 48px;
      height: 48px;

      opacity: 0.5;
      filter: blur(24px);
    `,
    icon: css`
      position: absolute;
      z-index: 1;
      inset-block-end: -12px;
      inset-inline-end: 16px;

      flex: none;
    `,
  };
});

export default () => {
  const theme = useTheme();
  const { styles } = useStyles();
  return (
    <Center gap={8} horizontal>
      <Flexbox className={styles.card} padding={16}>
        <span>New Folder</span>
        <div className={styles.glow} style={{ background: theme.geekblue }} />
        <FileTypeIcon
          className={styles.icon}
          color={theme.geekblue}
          icon={<Icon color={'#fff'} icon={PlusIcon} />}
          size={56}
          type={'folder'}
        />
      </Flexbox>
      <Flexbox className={styles.card} padding={16}>
        <span>Upload File</span>
        <div className={styles.glow} style={{ background: theme.gold }} />
        <FileTypeIcon
          className={styles.icon}
          color={theme.gold}
          icon={<Icon color={'#fff'} icon={ArrowUpIcon} />}
          size={56}
        />
      </Flexbox>
      <Flexbox className={styles.card} padding={16}>
        <span>Upload Folder</span>
        <div className={styles.glow} style={{ background: theme.purple }} />
        <FileTypeIcon
          className={styles.icon}
          color={theme.purple}
          icon={<Icon color={'#fff'} icon={ArrowUpIcon} />}
          size={56}
          type={'folder'}
        />
      </Flexbox>
    </Center>
  );
};
