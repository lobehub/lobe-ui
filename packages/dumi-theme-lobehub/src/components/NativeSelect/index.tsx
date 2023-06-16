import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  SideObject,
  autoUpdate,
  flip,
  inner,
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInnerOffset,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead,
} from '@floating-ui/react';
import { CSSProperties, ReactNode, memo, useEffect, useRef, useState } from 'react';
import useControlledState from 'use-merge-value';

import SelectItem from './SelectItem';
import { useStyles } from './style';

interface OptionType {
  icon?: ReactNode;
  label: ReactNode;
  value: string | number | null;
}
export interface NativeSelectProps {
  onChange?: (index: number) => void;
  options?: OptionType[];
  prefixCls?: string;
  renderItem?: (item: OptionType, index: number) => ReactNode;
  renderValue?: (index: number) => ReactNode;
  style?: CSSProperties;
  value?: number;
}

const NativeSelect = memo<NativeSelectProps>(
  ({ options = [], value, prefixCls, onChange, renderValue, renderItem, style }) => {
    const cls = prefixCls ?? 'native-select';
    const [selectedIndex, setSelectedIndex] = useControlledState<number>(0, { onChange, value });

    const { styles } = useStyles(cls);
    const listReference = useRef<Array<HTMLElement | null>>([]);
    const listContentReference = useRef<Array<string | null>>([]);
    const overflowReference = useRef<SideObject>(null);
    const allowSelectReference = useRef(false);
    const allowMouseUpReference = useRef(true);
    const selectTimeoutReference = useRef<any>();
    const scrollReference = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [fallback, setFallback] = useState(false);
    const [innerOffset, setInnerOffset] = useState(0);
    const [touch, setTouch] = useState(false);
    const [blockSelection, setBlockSelection] = useState(false);

    if (!open) {
      if (innerOffset !== 0) setInnerOffset(0);

      if (fallback) setFallback(false);

      if (blockSelection) setBlockSelection(false);
    }

    const { x, y, strategy, refs, context } = useFloating({
      middleware: fallback
        ? [
            offset(5),
            touch ? shift({ crossAxis: true, padding: 10 }) : flip({ padding: 10 }),
            size({
              apply({ availableHeight }) {
                Object.assign(scrollReference.current?.style ?? {}, {
                  maxHeight: `${availableHeight}px`,
                });
              },
              padding: 10,
            }),
          ]
        : [
            inner({
              index: selectedIndex,
              listRef: listReference,
              minItemsVisible: touch ? 8 : 4,
              offset: innerOffset,
              onFallbackChange: setFallback,
              overflowRef: overflowReference,
              padding: 10,
              referenceOverflowThreshold: 20,
              scrollRef: scrollReference,
            }),
            offset({ crossAxis: -4 }),
          ],
      onOpenChange: setOpen,
      open,
      placement: 'bottom-start',
      whileElementsMounted: autoUpdate,
    });

    const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
      useClick(context, { event: 'mousedown' }),
      useDismiss(context),
      useRole(context, { role: 'listbox' }),
      useInnerOffset(context, {
        enabled: !fallback,
        onChange: setInnerOffset,
        overflowRef: overflowReference,
        scrollRef: scrollReference,
      }),
      useListNavigation(context, {
        activeIndex,
        listRef: listReference,
        onNavigate: setActiveIndex,
        selectedIndex,
      }),
      useTypeahead(context, {
        activeIndex,
        listRef: listContentReference,
        onMatch: open ? setActiveIndex : setSelectedIndex,
      }),
    ]);

    useEffect(() => {
      if (open) {
        selectTimeoutReference.current = setTimeout(() => {
          allowSelectReference.current = true;
        }, 300);

        return () => {
          clearTimeout(selectTimeoutReference.current);
        };
      }

      allowSelectReference.current = false;
      allowMouseUpReference.current = true;
    }, [open]);

    const { label } = options[selectedIndex] || {};

    return (
      <>
        <button
          aria-label={'selected-item'}
          className={styles.button}
          ref={refs.setReference}
          style={style}
          type={'button'}
          {...getReferenceProps({
            onPointerMove({ pointerType }) {
              if (pointerType === 'mouse') {
                setTouch(false);
              }
            },
            onTouchStart() {
              setTouch(true);
            },
          })}
        >
          {renderValue ? renderValue(selectedIndex) : label}
        </button>

        <FloatingPortal>
          {open && (
            <FloatingOverlay lockScroll={!touch} style={{ zIndex: 3000 }}>
              <FloatingFocusManager context={context} initialFocus={-1} modal={false}>
                <div
                  ref={refs.setFloating}
                  style={{
                    left: x ?? 0,
                    position: strategy,
                    top: y ?? 0,
                  }}
                >
                  <div
                    className={styles.container}
                    ref={scrollReference}
                    style={{ overflowY: 'auto' }}
                    {...getFloatingProps({
                      onContextMenu(e) {
                        e.preventDefault();
                      },
                    })}
                  >
                    {options.map((item, index) => {
                      return (
                        <SelectItem
                          disabled={blockSelection}
                          isActive={index === activeIndex}
                          isSelected={index === selectedIndex}
                          key={item.value}
                          label={renderItem ? renderItem(item, index) : item.label}
                          prefixCls={cls}
                          ref={(node) => {
                            listReference.current[index] = node;
                            listContentReference.current[index] = item.label as string;
                          }}
                          value={item.value}
                          {...getItemProps({
                            onClick() {
                              if (allowSelectReference.current) {
                                setSelectedIndex(index);
                                setOpen(false);
                              }
                            },
                            onKeyDown() {
                              allowSelectReference.current = true;
                            },
                            onMouseUp() {
                              if (!allowMouseUpReference.current) {
                                return;
                              }

                              if (allowSelectReference.current) {
                                setSelectedIndex(index);
                                setOpen(false);
                              }

                              // On touch devices, prevent the element from
                              // immediately closing `onClick` by deferring it
                              clearTimeout(selectTimeoutReference.current);
                              selectTimeoutReference.current = setTimeout(() => {
                                allowSelectReference.current = true;
                              });
                            },
                            onTouchStart() {
                              allowSelectReference.current = true;
                              allowMouseUpReference.current = false;
                            },
                          })}
                        />
                      );
                    })}
                  </div>
                </div>
              </FloatingFocusManager>
            </FloatingOverlay>
          )}
        </FloatingPortal>
      </>
    );
  },
);

export default NativeSelect;
