import { createStyles } from 'antd-style';
import { SparkleIcon } from 'lucide-react';
import { PropsWithChildren, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { Icon } from '@/index';

const useStyles = createStyles(({ css, token, isDarkMode }) => ({
  container: css`
    cursor: pointer;

    margin-block-start: 12px;
    padding-block: 16px;
    padding-inline: 16px;

    color: ${token.colorText};

    background: ${token.colorFillTertiary};
    border-radius: 8px;

    &:hover {
      background: ${isDarkMode ? '' : token.colorFillSecondary};
    }
  `,
  title: css`
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;

    font-size: 12px;
    text-overflow: ellipsis;
  `,
}));

const Render = memo<PropsWithChildren>(({ children }) => {
  const { styles, theme } = useStyles();

  return (
    <Flexbox className={styles.container} gap={16} width={'100%'}>
      <Flexbox distribution={'space-between'} flex={1} horizontal>
        <Flexbox gap={8} horizontal>
          <Icon color={theme.purple} icon={SparkleIcon} /> Artifact
        </Flexbox>
      </Flexbox>
      {children}
    </Flexbox>
  );
});

export default Render;
