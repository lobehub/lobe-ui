import {
  AlignVerticalSpaceAroundIcon,
  ChevronDown,
  ChevronRight,
  MinusIcon,
  PlusIcon,
} from 'lucide-react';
import { ReactNode, memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';
import { TransformComponent, TransformWrapper, useControls } from 'react-zoom-pan-pinch';

import ActionIcon from '@/ActionIcon';
import CopyButton from '@/CopyButton';

import { useStyles } from './style';
import { MermaidProps } from './type';

const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <Flexbox
      gap={4}
      horizontal
      style={{
        bottom: 8,
        position: 'absolute',
        right: 8,
        zIndex: 1,
      }}
    >
      <ActionIcon active glass icon={PlusIcon} onClick={() => zoomIn()} size={'small'} />
      <ActionIcon active glass icon={MinusIcon} onClick={() => zoomOut()} size={'small'} />
      <ActionIcon
        active
        glass
        icon={AlignVerticalSpaceAroundIcon}
        onClick={() => resetTransform()}
        size={'small'}
      />
    </Flexbox>
  );
};

export interface MermaidFullFeaturedProps extends Omit<MermaidProps, 'children'> {
  children: ReactNode;
  content: string;
}

export const MermaidFullFeatured = memo<MermaidFullFeaturedProps>(
  ({
    showLanguage,
    content,
    children,
    className,
    copyable,
    actionsRender,
    style,
    enablePanZoom = true,
    fileName = 'Mermaid',
    ...rest
  }) => {
    const [expand, setExpand] = useState(true);
    const { styles, cx } = useStyles('block');
    const container = cx(styles.container, className);

    const size = { blockSize: 24, fontSize: 14, strokeWidth: 2 };

    const originalActions = copyable && (
      <CopyButton content={content} placement="left" size={size} />
    );

    const actions = actionsRender
      ? actionsRender({ actionIconSize: size, content, originalNode: originalActions })
      : originalActions;

    return (
      <div className={container} data-code-type="mermaid" style={style} {...rest}>
        <Flexbox align={'center'} className={styles.header} horizontal justify={'space-between'}>
          <ActionIcon
            icon={expand ? ChevronDown : ChevronRight}
            onClick={() => setExpand(!expand)}
            size={{ blockSize: 24, fontSize: 14, strokeWidth: 3 }}
          />
          {showLanguage && (
            <Flexbox
              align={'center'}
              className={styles.select}
              gap={2}
              horizontal
              justify={'center'}
            >
              {fileName}
            </Flexbox>
          )}
          <Flexbox align={'center'} flex={'none'} gap={4} horizontal>
            {actions}
          </Flexbox>
        </Flexbox>
        <div style={expand ? {} : { height: 0, overflow: 'hidden' }}>
          {enablePanZoom ? (
            <TransformWrapper initialScale={1}>
              {expand && <Controls />}
              <TransformComponent wrapperClass={styles.zoomPanContainer}>
                {children}
              </TransformComponent>
            </TransformWrapper>
          ) : (
            children
          )}
        </div>
      </div>
    );
  },
);

export default MermaidFullFeatured;
