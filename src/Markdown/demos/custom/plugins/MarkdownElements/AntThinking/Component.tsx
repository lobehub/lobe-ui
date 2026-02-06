import { Icon } from '@lobehub/ui';
import { createStaticStyles, cssVar, useThemeMode } from 'antd-style';
import { ChevronDown, ChevronRight, SparkleIcon } from 'lucide-react';
import { memo, type PropsWithChildren, useState } from 'react';

import { Flexbox } from '@/Flex';

const styles = createStaticStyles(({ css, cssVar }) => ({
  containerDark: css`
    cursor: pointer;

    padding-block: 8px;
    padding-inline: 12px;
    padding-inline-end: 12px;
    border-radius: 8px;

    color: ${cssVar.colorText};

    background: ${cssVar.colorFillTertiary};

    &:hover {
      background: ${cssVar.colorFillSecondary};
    }
  `,
  containerLight: css`
    cursor: pointer;

    padding-block: 8px;
    padding-inline: 12px;
    padding-inline-end: 12px;
    border-radius: 8px;

    color: ${cssVar.colorText};

    background: ${cssVar.colorFillTertiary};

    &:hover {
      background: ${cssVar.colorFillSecondary};
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
  const { isDarkMode } = useThemeMode();

  const [showDetail, setShowDetail] = useState(false);

  return (
    <Flexbox
      className={isDarkMode ? styles.containerDark : styles.containerLight}
      gap={16}
      width={'100%'}
      onClick={() => {
        setShowDetail(!showDetail);
      }}
    >
      <Flexbox horizontal distribution={'space-between'} flex={1}>
        <Flexbox horizontal gap={8}>
          <Icon color={cssVar.purple} icon={SparkleIcon} /> Thinking...
        </Flexbox>
        <Icon icon={showDetail ? ChevronDown : ChevronRight} />
      </Flexbox>
      {showDetail && <p>{children}</p>}
    </Flexbox>
  );
});

export default Render;
