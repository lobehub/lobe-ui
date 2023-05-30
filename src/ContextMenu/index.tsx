import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingNode,
  FloatingPortal,
  FloatingTree,
  offset,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
  useHover,
  useInteractions,
  useListNavigation,
  useMergeRefs,
  useRole,
  useTypeahead,
} from '@floating-ui/react';
import { Divider } from 'antd';
import { forwardRef, HTMLProps, useCallback, useEffect, useRef, useState } from 'react';

import MenuItem from './MenuItem';
import { useStyles } from './style';
import { GeneralItemType, MenuItemType } from './types';

export interface ContextMenuProps {
  /**
   * @description Container element for the context menu
   */
  container?: HTMLElement;
  /**
   * @description Items to be displayed in the context menu
   */
  items: MenuItemType[];
  /**
   * @description Label for the context menu
   */
  label?: string;
}

const MenuComponent = forwardRef<
  HTMLButtonElement,
  ContextMenuProps & HTMLProps<HTMLButtonElement>
>(({ items, label, container, ...props }, forwardedRef) => {
  const { styles } = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [allowHover, setAllowHover] = useState(false);

  const listItemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const listContentRef = useRef<string[]>(items.map((item) => (item as GeneralItemType).label));

  const allowMouseUpCloseRef = useRef(false);

  const tree = useFloatingTree();
  const nodeId = useFloatingNodeId();
  const parentId = useFloatingParentNodeId();
  const isNested = parentId !== null;

  const { refs, floatingStyles, context } = useFloating<HTMLButtonElement>({
    nodeId,
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: isNested ? 'right-start' : 'bottom-start',
    middleware: [
      offset({ mainAxis: isNested ? 0 : 4, alignmentAxis: isNested ? -4 : 0 }),
      flip(),
      shift(),
    ],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {
    enabled: isNested && allowHover,
    delay: { open: 75 },
    handleClose: safePolygon({
      blockPointerEvents: true,
    }),
  });
  const click = useClick(context, {
    event: 'mousedown',
    toggle: !isNested || !allowHover,
    ignoreMouse: isNested,
  });
  const role = useRole(context, { role: 'menu' });
  const dismiss = useDismiss(context);
  const listNavigation = useListNavigation(context, {
    listRef: listItemsRef,
    activeIndex,
    nested: isNested,
    onNavigate: setActiveIndex,
  });
  const typeahead = useTypeahead(context, {
    enabled: isOpen,
    listRef: listContentRef,
    onMatch: isOpen ? setActiveIndex : undefined,
    activeIndex,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    hover,
    click,
    role,
    dismiss,
    listNavigation,
    typeahead,
  ]);

  // Event emitter allows you to communicate across tree components.
  // This effect closes all menus when an item gets clicked anywhere
  // in the tree.
  useEffect(() => {
    if (!tree) return;

    function handleTreeClick() {
      setIsOpen(false);
    }

    function onSubMenuOpen(event: { nodeId: string; parentId: string }) {
      if (event.nodeId !== nodeId && event.parentId === parentId) {
        setIsOpen(false);
      }
    }

    tree.events.on('click', handleTreeClick);
    tree.events.on('menuopen', onSubMenuOpen);

    return () => {
      tree.events.off('click', handleTreeClick);
      tree.events.off('menuopen', onSubMenuOpen);
    };
  }, [tree, nodeId, parentId]);

  useEffect(() => {
    if (isOpen && tree) {
      tree.events.emit('menuopen', { parentId, nodeId });
    }
  }, [tree, isOpen, nodeId, parentId]);

  // Determine if "hover" logic can run based on the modality of input. This
  // prevents unwanted focus synchronization as menus open and close with
  // keyboard navigation and the cursor is resting on the menu.
  useEffect(() => {
    function onPointerMove({ pointerType }: PointerEvent) {
      if (pointerType !== 'touch') {
        setAllowHover(true);
      }
    }

    function onKeyDown() {
      setAllowHover(false);
    }

    window.addEventListener('pointermove', onPointerMove, {
      once: true,
      capture: true,
    });
    window.addEventListener('keydown', onKeyDown, true);
    return () => {
      window.removeEventListener('pointermove', onPointerMove, {
        capture: true,
      });
      window.removeEventListener('keydown', onKeyDown, true);
    };
  }, [allowHover]);

  useEffect(() => {
    let timeout: number;

    function onContextMenu(e: MouseEvent) {
      e.preventDefault();

      refs.setPositionReference({
        getBoundingClientRect() {
          return {
            width: 0,
            height: 0,
            x: e.clientX,
            y: e.clientY,
            top: e.clientY,
            right: e.clientX,
            bottom: e.clientY,
            left: e.clientX,
          };
        },
      });

      setIsOpen(true);
      clearTimeout(timeout);

      allowMouseUpCloseRef.current = false;
      timeout = window.setTimeout(() => {
        allowMouseUpCloseRef.current = true;
      }, 300);
    }

    function onMouseUp() {
      if (allowMouseUpCloseRef.current) {
        setIsOpen(false);
      }
    }

    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('mouseup', onMouseUp);
      clearTimeout(timeout);
    };
  }, [refs, container]);

  const renderMenuItem = useCallback(
    (item: MenuItemType, index: number) => {
      // 支持渲染分割线
      if ('type' in item && item.type === 'divider')
        return <Divider style={{ margin: '4px 12px', minWidth: 'auto', width: 'auto' }} />;

      const data = item as GeneralItemType;

      const props = {
        label: data.label,
        key: data.key,
        icon: data.icon,
        shortcut: data.shortcut,
        active: activeIndex === index,
        ...getItemProps({
          ref(node: HTMLButtonElement) {
            listItemsRef.current[index] = node;
          },
          onClick() {
            data.onClick?.();
            setIsOpen(false);
          },
          onMouseUp() {
            data.onClick?.();
            setIsOpen(false);
          },
        }),
      };

      if ('children' in item) {
        return <MenuComponent {...props} items={item.children} />;
      }

      return <MenuItem {...props} />;
    },
    [activeIndex],
  );

  const referenceRef = useMergeRefs([refs.setReference, forwardedRef]);

  return (
    <FloatingNode id={nodeId}>
      {!label ? null : (
        <MenuItem
          label={label}
          nested={isNested}
          ref={referenceRef as any}
          role={isNested ? 'menuitem' : 'menu'}
          {...props}
          {...getReferenceProps({
            onClick(event) {
              event.stopPropagation();
            },
          })}
        />
      )}
      <FloatingPortal>
        {isOpen && (
          <FloatingFocusManager
            context={context}
            initialFocus={isNested ? -1 : 0}
            modal={false}
            returnFocus={!isNested}
          >
            <div
              className={styles.container}
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
            >
              {items?.map(renderMenuItem)}
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </FloatingNode>
  );
});

const ContextMenu = forwardRef<HTMLButtonElement, ContextMenuProps & HTMLProps<HTMLButtonElement>>(
  (props, ref) => (
    <FloatingTree>
      <MenuComponent {...props} ref={ref} />
    </FloatingTree>
  ),
);

export default ContextMenu;
