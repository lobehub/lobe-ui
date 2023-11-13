import {
  FloatingFocusManager,
  FloatingNode,
  FloatingPortal,
  FloatingTree,
  autoUpdate,
  flip,
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
import { HTMLProps, forwardRef, useCallback, useEffect, useRef, useState } from 'react';

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
>(({ items, label, container, ...rest }, forwardedReference) => {
  const { styles } = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [allowHover, setAllowHover] = useState(false);

  const listItemsReference = useRef<Array<HTMLButtonElement | null>>([]);
  const listContentReference = useRef<string[]>(
    items.map((item) => (item as GeneralItemType).label),
  );

  const allowMouseUpCloseReference = useRef(false);

  const tree = useFloatingTree();
  const nodeId = useFloatingNodeId();
  const parentId = useFloatingParentNodeId();
  const isNested = parentId !== null;

  const { refs, context } = useFloating<HTMLButtonElement>({
    middleware: [
      offset({ alignmentAxis: isNested ? -4 : 0, mainAxis: isNested ? 0 : 4 }),
      flip(),
      shift(),
    ],
    nodeId,
    onOpenChange: setIsOpen,
    open: isOpen,
    placement: isNested ? 'right-start' : 'bottom-start',
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {
    delay: { open: 75 },
    enabled: isNested && allowHover,
    handleClose: safePolygon({
      blockPointerEvents: true,
    }),
  });
  const click = useClick(context, {
    event: 'mousedown',
    ignoreMouse: isNested,
    toggle: !isNested || !allowHover,
  });
  const role = useRole(context, { role: 'menu' });
  const dismiss = useDismiss(context);
  const listNavigation = useListNavigation(context, {
    activeIndex,
    listRef: listItemsReference,
    nested: isNested,
    onNavigate: setActiveIndex,
  });
  const typeahead = useTypeahead(context, {
    activeIndex,
    enabled: isOpen,
    listRef: listContentReference,
    onMatch: isOpen ? setActiveIndex : undefined,
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
      tree.events.emit('menuopen', { nodeId, parentId });
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
      capture: true,
      once: true,
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
            bottom: e.clientY,
            height: 0,
            left: e.clientX,
            right: e.clientX,
            top: e.clientY,
            width: 0,
            x: e.clientX,
            y: e.clientY,
          };
        },
      });

      setIsOpen(true);
      clearTimeout(timeout);

      allowMouseUpCloseReference.current = false;
      timeout = window.setTimeout(() => {
        allowMouseUpCloseReference.current = true;
      }, 300);
    }

    function onMouseUp() {
      if (allowMouseUpCloseReference.current) {
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
        active: activeIndex === index,
        icon: data.icon,
        key: data.key,
        label: data.label,
        shortcut: data.shortcut,
        ...getItemProps({
          onClick() {
            data.onClick?.();
            setIsOpen(false);
          },
          onMouseUp() {
            data.onClick?.();
            setIsOpen(false);
          },
          ref(node: HTMLButtonElement) {
            listItemsReference.current[index] = node;
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

  const referenceReference = useMergeRefs([refs.setReference, forwardedReference]);

  return (
    <FloatingNode id={nodeId}>
      {label ? (
        <MenuItem
          label={label}
          nested={isNested}
          ref={referenceReference as any}
          role={isNested ? 'menuitem' : 'menu'}
          {...rest}
          {...getReferenceProps({
            onClick(event) {
              event.stopPropagation();
            },
          })}
        />
      ) : null}
      <FloatingPortal>
        {isOpen && (
          <FloatingFocusManager
            context={context}
            initialFocus={isNested ? -1 : 0}
            modal={false}
            returnFocus={!isNested}
          >
            <div className={styles.container} ref={refs.setFloating} {...getFloatingProps()}>
              {items?.map(renderMenuItem)}
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </FloatingNode>
  );
});

const ContextMenu = forwardRef<HTMLButtonElement, ContextMenuProps & HTMLProps<HTMLButtonElement>>(
  (props, reference) => (
    <FloatingTree>
      <MenuComponent {...props} ref={reference} />
    </FloatingTree>
  ),
);

export default ContextMenu;
