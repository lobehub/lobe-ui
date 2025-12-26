import { Icon } from '@lobehub/ui';
import { createStaticStyles, cssVar, useThemeMode } from 'antd-style';
import { SparkleIcon } from 'lucide-react';
import { PropsWithChildren, memo } from 'react';

import { Flexbox } from '@/Flex';

const styles = createStaticStyles(({ css, cssVar }) => ({
  containerDark: css`
    cursor: pointer;

    margin-block-start: 12px;
    padding-block: 16px;
    padding-inline: 16px;
    border-radius: 8px;

    color: ${cssVar.colorText};

    background: ${cssVar.colorFillTertiary};

    &:hover {
      background: '';
    }
  `,
  containerLight: css`
    cursor: pointer;

    margin-block-start: 12px;
    padding-block: 16px;
    padding-inline: 16px;
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

  return (
    <Flexbox
      className={isDarkMode ? styles.containerDark : styles.containerLight}
      gap={16}
      width={'100%'}
    >
      <Flexbox distribution={'space-between'} flex={1} horizontal>
        <Flexbox gap={8} horizontal>
          <Icon color={cssVar.purple} icon={SparkleIcon} /> Artifact
        </Flexbox>
      </Flexbox>
      <div dangerouslySetInnerHTML={{ __html: String(children) }} />
    </Flexbox>
  );
});

export default Render;
