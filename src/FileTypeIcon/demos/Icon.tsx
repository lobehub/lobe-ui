import { FileTypeIcon, Icon } from '@lobehub/ui';
import { createStaticStyles, cssVar } from 'antd-style';
import { ArrowUpIcon, PlusIcon } from 'lucide-react';

import { Center, Flexbox } from '@/Flex';

const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    card: css`
      position: relative;

      overflow: hidden;

      width: 150px;
      height: 100px;
      border-radius: ${cssVar.borderRadiusLG};

      font-weight: 500;
      text-align: center;

      background: ${cssVar.colorFillTertiary};
      box-shadow: 0 0 0 1px ${cssVar.colorFillTertiary} inset;
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
  return (
    <Center horizontal gap={8}>
      <Flexbox className={styles.card} padding={16}>
        <span>New Folder</span>
        <div className={styles.glow} style={{ background: cssVar.geekblue }} />
        <FileTypeIcon
          className={styles.icon}
          color={cssVar.geekblue}
          icon={<Icon color={'#fff'} icon={PlusIcon} />}
          size={56}
          type={'folder'}
        />
      </Flexbox>
      <Flexbox className={styles.card} padding={16}>
        <span>Upload File</span>
        <div className={styles.glow} style={{ background: cssVar.gold }} />
        <FileTypeIcon
          className={styles.icon}
          color={cssVar.gold}
          icon={<Icon color={'#fff'} icon={ArrowUpIcon} />}
          size={56}
        />
      </Flexbox>
      <Flexbox className={styles.card} padding={16}>
        <span>Upload Folder</span>
        <div className={styles.glow} style={{ background: cssVar.purple }} />
        <FileTypeIcon
          className={styles.icon}
          color={cssVar.purple}
          icon={<Icon color={'#fff'} icon={ArrowUpIcon} />}
          size={56}
          type={'folder'}
        />
      </Flexbox>
    </Center>
  );
};
