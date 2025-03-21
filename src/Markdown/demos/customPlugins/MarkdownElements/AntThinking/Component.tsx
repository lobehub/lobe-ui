import { createStyles } from 'antd-style';
import { ChevronDown, ChevronLeft, ChevronRight, SparkleIcon } from 'lucide-react';
import { PropsWithChildren, memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useDirection } from '@/hooks/useDirection';
import { Icon } from '@/index';

const useStyles = createStyles(({ css, token, isDarkMode }) => ({
  container: css`
    cursor: pointer;

    padding-block: 8px;
    padding-inline: 12px;
    padding-inline-end: 12px;
    border-radius: 8px;

    color: ${token.colorText};

    background: ${token.colorFillTertiary};

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
  const direction = useDirection();

  const [showDetail, setShowDetail] = useState(false);

  return (
    <Flexbox
      className={styles.container}
      gap={16}
      onClick={() => {
        setShowDetail(!showDetail);
      }}
      width={'100%'}
    >
      <Flexbox distribution={'space-between'} flex={1} horizontal>
        <Flexbox gap={8} horizontal>
          <Icon color={theme.purple} icon={SparkleIcon} /> Thinking...
        </Flexbox>
        <Icon icon={showDetail ? ChevronDown : direction === 'rtl' ? ChevronLeft : ChevronRight} />
      </Flexbox>
      {showDetail && children}
    </Flexbox>
  );
});

export default Render;
