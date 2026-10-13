'use client';

import clsx from 'clsx';
import {
  type CSSProperties,
  type ReactNode,
  type Ref,
  type RefObject,
  type UIEvent,
  type UIEventHandler,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { useEventCallback } from '@/hooks/useEventCallback';

import {
  TableColGroup,
  type TableColGroupColumn,
  TableContainer,
  TableElement,
  TableFooter,
  TableRoot,
  type TableRootProps,
  TableScroll,
  TableTitle,
} from '../atoms';
import type { StickyOffsets } from '../engine/fixed';
import type { HeaderCellModel, RowModel, VirtualModel } from '../engine/types';
import type { ColumnSource } from '../pipeline/normalizeColumns';
import { Body } from './Body';
import { useTableView } from './context';
import { HeaderRows } from './Header';
import StickyScrollBar, { type StickyScrollBarApi } from './StickyScrollBar';
import { SummaryFooter, SummaryProvider } from './Summary';
import VirtualBody from './VirtualBody';

export interface StickyConfig {
  container: HTMLElement | Window;
  isSticky: boolean;
  offsetHeader: number;
  offsetScroll: number;
  offsetSummary: number;
}

export interface TableViewProps<T> extends Pick<
  TableRootProps,
  'grouped' | 'hoverable' | 'size' | 'variant'
> {
  bodyRef: RefObject<HTMLDivElement | null>;
  className?: string;
  colWidths: readonly number[];
  emptyNode: ReactNode;
  fixFooter: false | true | 'top' | 'bottom';
  fixHeader: boolean;
  footer?: ReactNode;
  headerRows: readonly HeaderCellModel<ColumnSource<T>>[][];
  offsets: StickyOffsets;
  onColumnResize: (key: string, width: number) => void;
  onScroll?: UIEventHandler<HTMLDivElement>;
  ref?: Ref<HTMLDivElement>;
  rows: readonly RowModel<T>[];
  scrollX?: number | string | true;
  scrollY?: number | string;
  showHeader: boolean;
  sticky: StickyConfig;
  style?: CSSProperties;
  summaryNode: ReactNode;
  tableLayout: 'auto' | 'fixed';
  title?: ReactNode;
  virtual?: VirtualModel;
}

const forceScroll = (scrollLeft: number, target: HTMLElement | null | undefined) => {
  if (target && target.scrollLeft !== scrollLeft) target.scrollLeft = scrollLeft;
};

const FixedHolder = ({
  children,
  className,
  colGroup,
  holderRef,
  onWheelX,
  stickyStyle,
  tableLayout,
  scrollX,
}: {
  children: ReactNode;
  className: string;
  colGroup: ReactNode;
  holderRef: Ref<HTMLDivElement>;
  onWheelX: (target: HTMLDivElement, scrollLeft: number) => void;
  scrollX?: number | string | true;
  stickyStyle?: CSSProperties;
  tableLayout: 'auto' | 'fixed';
}) => {
  const { components } = useTableView();
  const ref = useRef<HTMLDivElement | null>(null);
  const onWheel = useEventCallback(onWheelX);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const handler = (event: WheelEvent) => {
      if (!event.deltaX) return;
      const max = element.scrollWidth - element.clientWidth;
      const next = Math.min(Math.max(element.scrollLeft + event.deltaX, 0), max);
      onWheel(element, next);
      event.preventDefault();
    };
    element.addEventListener('wheel', handler, { passive: false });
    return () => element.removeEventListener('wheel', handler);
  }, [onWheel]);

  const setRef = useCallback(
    (element: HTMLDivElement | null) => {
      ref.current = element;
      if (typeof holderRef === 'function') holderRef(element);
      else if (holderRef) holderRef.current = element;
    },
    [holderRef],
  );

  return (
    <div className={className} ref={setRef} style={{ overflow: 'hidden', ...stickyStyle }}>
      <TableElement
        component={components.headerTable}
        style={{ minWidth: '100%', tableLayout, width: scrollX === true ? 'auto' : scrollX }}
      >
        {colGroup}
        {children}
      </TableElement>
    </div>
  );
};

const TableView = <T,>({
  bodyRef,
  className,
  colWidths,
  emptyNode,
  fixFooter,
  fixHeader,
  footer,
  grouped,
  headerRows,
  hoverable,
  offsets,
  onColumnResize,
  onScroll,
  ref,
  rows,
  scrollX,
  scrollY,
  showHeader,
  size,
  sticky,
  style,
  summaryNode,
  tableLayout,
  title,
  variant,
  virtual,
}: TableViewProps<T>) => {
  const view = useTableView<T>();
  const { horizonScroll, leafColumns, prefixCls, semanticClassNames, semanticStyles } = view;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const summaryRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<StickyScrollBarApi>(null);
  const shadowRef = useRef({ end: false, start: false });
  const lockRef = useRef<{ target: EventTarget | null; timer?: ReturnType<typeof setTimeout> }>({
    target: null,
  });
  const [scrollbarSize, setScrollbarSize] = useState(0);
  const [, forceRender] = useState(0);

  const applyShadow = () => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.toggle(
      `${prefixCls}-fix-start-shadow-show`,
      horizonScroll && shadowRef.current.start,
    );
    root.classList.toggle(
      `${prefixCls}-fix-end-shadow-show`,
      horizonScroll && shadowRef.current.end,
    );
  };

  const onInternalScroll = useEventCallback(
    ({
      currentTarget,
      scrollLeft,
    }: {
      currentTarget?: HTMLElement | null;
      scrollLeft?: number;
    }) => {
      const target = currentTarget ?? bodyRef.current;
      const left = typeof scrollLeft === 'number' ? scrollLeft : (target?.scrollLeft ?? 0);
      const lock = lockRef.current;
      if (!lock.target || lock.target === target) {
        lock.target = target ?? null;
        clearTimeout(lock.timer);
        lock.timer = setTimeout(() => {
          lock.target = null;
        }, 100);
        forceScroll(left, headerRef.current);
        forceScroll(left, bodyRef.current);
        forceScroll(left, summaryRef.current);
        stickyRef.current?.setScrollLeft(left);
      }
      const measure = target ?? headerRef.current;
      if (measure) {
        const { clientWidth, scrollWidth } = measure;
        const abs = Math.abs(left);
        shadowRef.current =
          scrollWidth === clientWidth
            ? { end: false, start: false }
            : { end: abs < scrollWidth - clientWidth - 1, start: abs > 0 };
        applyShadow();
      }
    },
  );

  const onBodyScroll = (event: UIEvent<HTMLDivElement>) => {
    onInternalScroll({ currentTarget: event.currentTarget });
    onScroll?.(event);
  };

  useLayoutEffect(() => {
    applyShadow();
  });

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === 'undefined') return;
    const update = () => {
      root.style.setProperty('--lobe-table-component-width', `${root.offsetWidth}px`);
      stickyRef.current?.checkVisible();
      if (horizonScroll) onInternalScroll({ currentTarget: bodyRef.current });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(root);
    return () => observer.disconnect();
  }, [horizonScroll, bodyRef, onInternalScroll]);

  useEffect(() => {
    if (horizonScroll) onInternalScroll({ currentTarget: bodyRef.current });
  }, [horizonScroll, rows, leafColumns.length, bodyRef, onInternalScroll]);

  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (!fixHeader || !body) return;
    const size = body.offsetWidth - body.clientWidth;
    setScrollbarSize((previous) => (previous === size ? previous : Math.max(0, size)));
  });

  useEffect(() => {
    if (sticky.isSticky) forceRender((count) => count + 1);
  }, [sticky.isSticky]);

  const setRootRef = useCallback(
    (element: HTMLDivElement | null) => {
      rootRef.current = element;
      if (typeof ref === 'function') ref(element);
      else if (ref) ref.current = element;
    },
    [ref],
  );

  const colGroupColumns: TableColGroupColumn[] = leafColumns.map((leaf, index) => ({
    className: leaf.column.source.colClassName,
    minWidth:
      tableLayout === 'auto'
        ? (leaf.column.source.column as { minWidth?: number }).minWidth
        : undefined,
    width: view.virtualWidths ? view.virtualWidths[index] : leaf.column.width,
  }));
  const bodyColGroup = <TableColGroup columns={colGroupColumns} />;

  const allMeasured =
    rows.length > 0 &&
    colWidths.length === leafColumns.length &&
    colWidths.every((width) => width !== undefined) &&
    !colWidths.every((width) => !width);
  const headerScrollbar = sticky.isSticky && !fixHeader ? 0 : scrollbarSize;
  const holderColGroup =
    allMeasured || headerScrollbar ? (
      <TableColGroup
        columns={[
          ...(allMeasured
            ? colWidths.map((width, index) => ({ ...colGroupColumns[index], width }))
            : colGroupColumns),
          ...(headerScrollbar ? [{ width: headerScrollbar }] : []),
        ]}
      />
    ) : (
      bodyColGroup
    );

  const scrollTableStyle: CSSProperties | undefined = horizonScroll
    ? { minWidth: '100%', width: scrollX === true ? 'auto' : scrollX }
    : undefined;
  const scrollXStyle: CSSProperties | undefined = horizonScroll ? { overflowX: 'auto' } : undefined;
  const scrollYStyle: CSSProperties | undefined = fixHeader
    ? { maxHeight: scrollY, overflowY: rows.length > 0 ? 'scroll' : 'auto' }
    : horizonScroll
      ? { overflowY: 'hidden' }
      : undefined;

  const summary = summaryNode ? <SummaryFooter>{summaryNode}</SummaryFooter> : null;
  const stickyHolderClass = sticky.isSticky ? `${prefixCls}-sticky-holder` : undefined;
  const headerRowsNode = <HeaderRows rows={headerRows} scrollbar={headerScrollbar} />;

  let content: ReactNode;
  if (fixHeader || sticky.isSticky || virtual) {
    const bodyNode = virtual ? (
      <VirtualBody
        emptyNode={emptyNode}
        holderRef={bodyRef}
        maxHeight={scrollY}
        rows={rows}
        scrollX={scrollX}
        virtual={virtual}
        onScroll={onBodyScroll}
      />
    ) : (
      <TableScroll
        part="body"
        ref={bodyRef}
        style={{ ...scrollXStyle, ...scrollYStyle }}
        onScroll={onBodyScroll}
      >
        <TableElement
          component={view.components.table}
          style={{ ...scrollTableStyle, tableLayout }}
        >
          {bodyColGroup}
          <Body measure emptyNode={emptyNode} rows={rows} onColumnResize={onColumnResize} />
          {!fixFooter && summary}
        </TableElement>
      </TableScroll>
    );

    content = (
      <>
        {showHeader && (
          <FixedHolder
            className={clsx(`${prefixCls}-header`, stickyHolderClass)}
            colGroup={holderColGroup}
            holderRef={headerRef}
            scrollX={scrollX}
            tableLayout={tableLayout}
            stickyStyle={
              sticky.isSticky ? { position: 'sticky', top: sticky.offsetHeader } : undefined
            }
            onWheelX={(target, scrollLeft) =>
              onInternalScroll({ currentTarget: target, scrollLeft })
            }
          >
            {headerRowsNode}
            {fixFooter === 'top' && summary}
          </FixedHolder>
        )}
        {bodyNode}
        {fixFooter && fixFooter !== 'top' && (
          <FixedHolder
            className={clsx(`${prefixCls}-summary`, stickyHolderClass)}
            colGroup={holderColGroup}
            holderRef={summaryRef}
            scrollX={scrollX}
            tableLayout={tableLayout}
            stickyStyle={
              sticky.isSticky ? { bottom: sticky.offsetSummary, position: 'sticky' } : undefined
            }
            onWheelX={(target, scrollLeft) =>
              onInternalScroll({ currentTarget: target, scrollLeft })
            }
          >
            {summary}
          </FixedHolder>
        )}
        {sticky.isSticky && bodyRef.current && (
          <StickyScrollBar
            bodyRef={bodyRef}
            container={sticky.container}
            offsetScroll={sticky.offsetScroll}
            prefixCls={prefixCls}
            ref={stickyRef}
            onScroll={onInternalScroll}
          />
        )}
      </>
    );
  } else {
    content = (
      <TableScroll
        className={semanticClassNames.content}
        part="content"
        ref={bodyRef}
        style={{ ...scrollXStyle, ...scrollYStyle, ...semanticStyles.content }}
        onScroll={onBodyScroll}
      >
        <TableElement
          component={view.components.table}
          style={{ ...scrollTableStyle, tableLayout }}
        >
          {bodyColGroup}
          {showHeader && headerRowsNode}
          <Body
            emptyNode={emptyNode}
            measure={horizonScroll}
            rows={rows}
            onColumnResize={onColumnResize}
          />
          {summary}
        </TableElement>
      </TableScroll>
    );
  }

  const first = leafColumns[0];
  const last = leafColumns.at(-1);

  return (
    <SummaryProvider value={{ leaves: leafColumns, offsets }}>
      <TableRoot
        grouped={grouped}
        hoverable={hoverable}
        ref={setRootRef}
        size={size}
        variant={variant}
        className={clsx(
          className,
          horizonScroll && [`${prefixCls}-fix-start-shadow`, `${prefixCls}-fix-end-shadow`],
          tableLayout === 'fixed' && `${prefixCls}-layout-fixed`,
          fixHeader && `${prefixCls}-fixed-header`,
          horizonScroll && leafColumns.some((leaf) => leaf.fixed) && `${prefixCls}-fixed-column`,
          horizonScroll && `${prefixCls}-scroll-horizontal`,
          first?.fixed && `${prefixCls}-has-fix-start`,
          last?.fixed === 'end' && `${prefixCls}-has-fix-end`,
          virtual && `${prefixCls}-virtual`,
        )}
        style={
          sticky.isSticky
            ? ({ ...style, '--columns-count': leafColumns.length } as CSSProperties)
            : style
        }
      >
        {title !== undefined && (
          <TableTitle className={semanticClassNames.title} style={semanticStyles.title}>
            {title}
          </TableTitle>
        )}
        <TableContainer className={semanticClassNames.section} style={semanticStyles.section}>
          {content}
        </TableContainer>
        {footer !== undefined && (
          <TableFooter className={semanticClassNames.footer} style={semanticStyles.footer}>
            {footer}
          </TableFooter>
        )}
      </TableRoot>
    </SummaryProvider>
  );
};

export default TableView;
