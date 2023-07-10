import { useHover } from 'ahooks';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import type { Enable, NumberSize, Size } from 're-resizable';
import { HandleClassName, Resizable } from 're-resizable';
import { type CSSProperties, memo, useEffect, useMemo, useRef, useState } from 'react';
import { Center } from 'react-layout-kit';
import type { Props as RndProps } from 'react-rnd';
import useControlledState from 'use-merge-value';

import { DivProps } from '@/types';

import { useStyles } from './style';
import { revesePlacement } from './utils';

const DEFAULT_HEIGHT = 180;
const DEFAULT_WIDTH = 280;

export type placementType = 'right' | 'left' | 'top' | 'bottom';

export interface DraggablePanelProps extends DivProps {
  /**
   * @title The class name for the content and handle component
   */
  classNames?: {
    content?: string;
    handle?: string;
  };
  /**
   * @description The default expand state of the panel
   * @default true
   */
  defaultExpand?: boolean;
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
   * @description Whether the panel is expanded or not
   */
  expand?: boolean;
  /**
   * @description Whether the panel is expandable or not
   * @default true
   */
  expandable?: boolean;
  fullscreen?: boolean;
  /**
   * @description The style of the panel handler
   * @type CSSProperties
   */
  hanlderStyle?: CSSProperties;
  maxHeight?: number;
  maxWidth?: number;
  /**
   * @description The minimum height of the panel
   */
  minHeight?: number;
  /**
   * @description The minimum width of the panel
   */
  minWidth?: number;
  /**
   * @description The mode of the panel, fixed or float
   * @default 'fixed'
   */
  mode?: 'fixed' | 'float';
  /**
   * @description Callback function when the expand state of the panel changes
   */
  onExpandChange?: (expand: boolean) => void;
  /**
   * @description Callback function when the size of the panel changes
   */
  onSizeChange?: (delta: NumberSize, size?: Size) => void;
  /**
   * @description Callback function when the panel is being resized
   */
  onSizeDragging?: (delta: NumberSize, size?: Size) => void;
  /**
   * @description Whether the panel can be pinned or not
   * @default true
   */
  pin?: boolean;
  /**
   * @description The placement of the panel, right, left, top or bottom
   * @default 'right'
   */
  placement: placementType;
  /**
   * @description Whether the panel can be resized or not
   * @default true
   */
  resize?: RndProps['enableResizing'];
  /**
   * @description Whether the panel handler should be shown when unexpanded or not
   * @default true
   */
  showHandlerWhenUnexpand?: boolean;
  /**
   * @description The size of the panel
   */
  size?: Partial<Size>;
}

const DraggablePanel = memo<DraggablePanelProps>(
  ({
    fullscreen,
    maxHeight,
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
    maxWidth,
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
    const reference: any = useRef();
    const isHovering = useHover(reference);
    const isVertical = placement === 'top' || placement === 'bottom';

    const { styles, cx } = useStyles();

    const [isExpand, setIsExpand] = useControlledState(defaultExpand, {
      onChange: onExpandChange,
      value: expand,
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
    const [isResizing, setIsResizing] = useState(false);
    const canResizing = resize !== false && isExpand;

    const resizeHandleClassNames: HandleClassName = useMemo(() => {
      if (!canResizing) return {};

      return {
        [revesePlacement(placement)]: styles[`${revesePlacement(placement)}Handle`],
      };
    }, [canResizing, placement]);

    const resizing = {
      bottom: false,
      bottomLeft: false,
      bottomRight: false,
      left: false,
      right: false,
      top: false,
      topLeft: false,
      topRight: false,
      [revesePlacement(placement)]: true,
      ...(resize as Enable),
    };

    const defaultSize: Size = useMemo(() => {
      if (isVertical)
        return {
          height: DEFAULT_HEIGHT,
          width: '100%',
          ...customizeDefaultSize,
        };

      return {
        height: '100%',
        width: DEFAULT_WIDTH,
        ...customizeDefaultSize,
      };
    }, [isVertical]);

    const sizeProps = isExpand
      ? {
          defaultSize,
          maxHeight: typeof maxHeight === 'number' ? Math.max(maxHeight, 0) : maxHeight,
          maxWidth: typeof maxWidth === 'number' ? Math.max(maxWidth, 0) : maxWidth,
          minHeight: typeof minHeight === 'number' ? Math.max(minHeight, 0) : minHeight,
          minWidth: typeof minWidth === 'number' ? Math.max(minWidth, 0) : minWidth,
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
        case 'top': {
          return { Arrow: ChevronDown, className: 'Bottom' };
        }
        case 'bottom': {
          return { Arrow: ChevronUp, className: 'Top' };
        }
        case 'right': {
          return { Arrow: ChevronLeft, className: 'Left' };
        }
        case 'left': {
          return { Arrow: ChevronRight, className: 'Right' };
        }
      }
    }, [styles, placement]);

    const handler = (
      <Center
        // @ts-ignore
        className={cx(styles[`toggle${arrowPlacement}`], classNames.handle)}
        style={{ opacity: isExpand ? (pin ? undefined : 0) : showHandlerWhenUnexpand ? 1 : 0 }}
      >
        <Center
          onClick={() => {
            setIsExpand(!isExpand);
          }}
          style={hanlderStyle}
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
        className={cx(styles.panel, classNames.content)}
        enable={canResizing ? (resizing as Enable) : undefined}
        handleClasses={resizeHandleClassNames}
        onResize={(_, direction, reference_, delta) => {
          onSizeDragging?.(delta, {
            height: reference_.style.height,
            width: reference_.style.width,
          });
        }}
        onResizeStart={() => {
          setIsResizing(true);
          setShowExpand(false);
        }}
        onResizeStop={(e, direction, reference_, delta) => {
          setIsResizing(false);
          setShowExpand(true);
          onSizeChange?.(delta, {
            height: reference_.style.height,
            width: reference_.style.width,
          });
        }}
        style={{
          transition: isResizing ? 'unset' : undefined,
          ...style,
        }}
      >
        {children}
      </Resizable>
    );

    if (fullscreen) return <div className={cx(styles.fullscreen, className)}>{children}</div>;

    return (
      <aside
        className={cx(
          styles.container,
          // @ts-ignore
          styles[mode === 'fixed' ? 'fixed' : `${placement}Float`],
          className,
        )}
        ref={reference}
        style={isExpand ? { [`border${arrowPlacement}Width`]: 1 } : {}}
      >
        {expandable && showExpand && handler}
        {destroyOnClose ? isExpand && inner : inner}
      </aside>
    );
  },
);

export default DraggablePanel;
