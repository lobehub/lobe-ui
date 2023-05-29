import { useHover } from 'ahooks';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import type { Enable, NumberSize, Size } from 're-resizable';
import { HandleClassName, Resizable } from 're-resizable';
import { ReactNode, memo, useEffect, useMemo, useRef, useState } from 'react';
import { Center } from 'react-layout-kit';
import type { Props as RndProps } from 'react-rnd';
import useControlledState from 'use-merge-value';

import { DivProps } from '@/types';
import { useStyle } from './style';
import { revesePlacement } from './utils';

const DEFAULT_HEIGHT = 180;
const DEFAULT_WIDTH = 280;

export type placementType = 'right' | 'left' | 'top' | 'bottom';

export interface DraggablePanelProps extends DivProps {
  /**
   * @description Whether the panel can be pinned or not
   * @default true
   */
  pin?: boolean;
  /**
   * @description The mode of the panel, fixed or float
   * @default 'fixed'
   */
  mode?: 'fixed' | 'float';
  /**
   * @description The placement of the panel, right, left, top or bottom
   * @default 'right'
   */
  placement: placementType;
  /**
   * @description The minimum width of the panel
   */
  minWidth?: number;
  /**
   * @description The minimum height of the panel
   */
  minHeight?: number;
  /**
   * @description Whether the panel can be resized or not
   * @default true
   */
  resize?: RndProps['enableResizing'];
  /**
   * @description The size of the panel
   */
  size?: Partial<Size>;
  /**
   * @description Callback function when the size of the panel changes
   */
  onSizeChange?: (delta: NumberSize, size?: Size) => void;
  /**
   * @description Callback function when the panel is being resized
   */
  onSizeDragging?: (delta: NumberSize, size?: Size) => void;
  /**
   * @description Whether the panel is expandable or not
   * @default true
   */
  expandable?: boolean;
  /**
   * @description Whether the panel is expanded or not
   */
  expand?: boolean;
  /**
   * @description The default expand state of the panel
   * @default true
   */
  defaultExpand?: boolean;
  /**
   * @description Callback function when the expand state of the panel changes
   */
  onExpandChange?: (expand: boolean) => void;
  /**
   * @description The default size of the panel
   */
  defaultSize?: Partial<Size>;
  /**
   * @description Whether the panel should be destroyed when closed or not
   * @default false
   */
  destroyOnClose?: boolean;
  /**
   * @description Whether the panel handler should be shown when unexpanded or not
   * @default true
   */
  showHandlerWhenUnexpand?: boolean;
  /**
   * @description The style of the panel handler
   * @type CSSProperties
   */
  hanlderStyle?: React.CSSProperties;
  children: ReactNode;
  className?: string;
  classNames?: {
    handle?: string;
    content?: string;
  };
}

const DraggablePanel = memo<DraggablePanelProps>(
  ({
    pin = 'true',
    mode = 'fixed',
    children,
    placement = 'right',
    resize,
    style,
    size,
    defaultSize: customizeDefaultSize,
    minWidth,
    minHeight,
    onSizeChange,
    onSizeDragging,
    expandable = true,
    expand,
    defaultExpand = true,
    onExpandChange,
    className,
    showHandlerWhenUnexpand,
    destroyOnClose,
    hanlderStyle,
    classNames = {},
  }) => {
    const ref = useRef(null);
    const isHovering = useHover(ref);
    const isVertical = placement === 'top' || placement === 'bottom';

    const { styles, cx } = useStyle('draggable-panel');

    const [isExpand, setIsExpand] = useControlledState(defaultExpand, {
      value: expand,
      onChange: onExpandChange,
    });

    useEffect(() => {
      if (pin) return;
      if (isHovering && !isExpand) {
        setIsExpand(true);
      } else if (!isHovering && isExpand) {
        setIsExpand(false);
      }
    }, [pin, isHovering, isExpand]);

    const [showExpand, setShowExpand] = useState(true);

    const canResizing = resize !== false && isExpand;

    const resizeHandleClassNames: HandleClassName = useMemo(() => {
      if (!canResizing) return {};

      return {
        [revesePlacement(placement)]: styles[`${revesePlacement(placement)}Handle`],
      };
    }, [canResizing, placement]);

    const resizing = {
      top: false,
      bottom: false,
      right: false,
      left: false,
      topRight: false,
      bottomRight: false,
      bottomLeft: false,
      topLeft: false,
      [revesePlacement(placement)]: true,
      ...(resize as Enable),
    };

    const defaultSize: Size = useMemo(() => {
      if (isVertical)
        return {
          width: '100%',
          height: DEFAULT_HEIGHT,
          ...customizeDefaultSize,
        };

      return {
        width: DEFAULT_WIDTH,
        height: '100%',
        ...customizeDefaultSize,
      };
    }, [isVertical]);

    const sizeProps = isExpand
      ? {
          minWidth: typeof minWidth === 'number' ? Math.max(minWidth, 0) : 280,
          minHeight: typeof minHeight === 'number' ? Math.max(minHeight, 0) : undefined,
          defaultSize,
          size: size as Size,
        }
      : isVertical
      ? {
          minHeight: 0,
          size: { height: 0 },
        }
      : {
          minWidth: 0,
          size: { width: 0 },
        };

    const { Arrow, className: arrowPlacement } = useMemo(() => {
      switch (placement) {
        case 'top':
          return { className: 'Bottom', Arrow: ChevronDown };
        case 'bottom':
          return { className: 'Top', Arrow: ChevronUp };
        case 'right':
          return { className: 'Left', Arrow: ChevronLeft };
        case 'left':
          return { className: 'Right', Arrow: ChevronRight };
      }
    }, [styles, placement]);

    const handler = (
      <Center
        // @ts-ignore
        className={cx(styles[`toggle${arrowPlacement}`], classNames.handle)}
        style={{ opacity: isExpand ? (!pin ? 0 : undefined) : showHandlerWhenUnexpand ? 1 : 0 }}
      >
        <Center
          style={hanlderStyle}
          onClick={() => {
            setIsExpand(!isExpand);
          }}
        >
          <div
            className={styles.handlerIcon}
            style={{ transform: `rotate(${isExpand ? 180 : 0}deg)` }}
          >
            <Arrow size={16} strokeWidth={1.5} />
          </div>
        </Center>
      </Center>
    );

    const inner = (
      // @ts-ignore
      <Resizable
        {...sizeProps}
        style={style}
        className={cx(styles.panel, classNames.content)}
        enable={canResizing ? (resizing as Enable) : undefined}
        handleClasses={resizeHandleClassNames}
        onResizeStop={(e, direction, ref, delta) => {
          setShowExpand(true);
          onSizeChange?.(delta, {
            width: ref.style.width,
            height: ref.style.height,
          });
        }}
        onResizeStart={() => {
          setShowExpand(false);
        }}
        onResize={(_, direction, ref, delta) => {
          onSizeDragging?.(delta, {
            width: ref.style.width,
            height: ref.style.height,
          });
        }}
      >
        {children}
      </Resizable>
    );

    return (
      <aside
        ref={ref}
        className={cx(
          styles.container,
          // @ts-ignore
          styles[mode === 'fixed' ? 'fixed' : `${placement}Float`],
          className,
        )}
        style={{ [`border${arrowPlacement}Width`]: 1 }}
      >
        {expandable && showExpand && handler}
        {destroyOnClose ? isExpand && inner : inner}
      </aside>
    );
  },
);

export default DraggablePanel;
