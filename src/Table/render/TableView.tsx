'use client';

import clsx from 'clsx';
import { type CSSProperties, type ReactNode, type UIEvent, useCallback } from 'react';

import {
  TableContainer,
  TableElement,
  TableFooter,
  TableRoot,
  TableScroll,
  TableTitle,
} from '../atoms';
import { Body } from './Body';
import { useTableView } from './context';
import { FixedHolder } from './FixedHolder';
import { HeaderRows } from './Header';
import StickyScrollBar from './StickyScrollBar';
import { SummaryFooter, SummaryProvider } from './Summary';
import { useColGroups } from './useColGroups';
import { useScrollSync } from './useScrollSync';
import type { TableViewProps } from './viewTypes';
import VirtualBody from './VirtualBody';

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
  virtualScrollRef,
}: TableViewProps<T>) => {
  const view = useTableView<T>();
  const { horizonScroll, leafColumns, prefixCls, semanticClassNames, semanticStyles } = view;
  const { headerRef, onInternalScroll, rootRef, scrollbarSize, stickyRef, summaryRef } =
    useScrollSync({
      bodyRef,
      columnCount: leafColumns.length,
      fixHeader,
      horizonScroll,
      prefixCls,
      rows,
      sticky: sticky.isSticky,
    });

  const onBodyScroll = (event: UIEvent<HTMLDivElement>) => {
    onInternalScroll({ currentTarget: event.currentTarget });
    onScroll?.(event);
  };

  const setRootRef = useCallback(
    (element: HTMLDivElement | null) => {
      rootRef.current = element;
      if (typeof ref === 'function') ref(element);
      else if (ref) ref.current = element;
    },
    [ref],
  );

  const headerScrollbar = sticky.isSticky && !fixHeader ? 0 : scrollbarSize;
  const { bodyColGroup, holderColGroup } = useColGroups({
    colWidths,
    headerScrollbar,
    leafColumns,
    rowCount: rows.length,
    tableLayout,
    virtualWidths: view.virtualWidths,
  });

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
  const holderSummary = summaryNode ? (
    <SummaryFooter scrollbar={headerScrollbar}>{summaryNode}</SummaryFooter>
  ) : null;
  const stickyHolderClass = sticky.isSticky ? `${prefixCls}-sticky-holder` : undefined;
  const headerRowsNode = <HeaderRows rows={headerRows} scrollbar={headerScrollbar} />;

  let content: ReactNode;
  if (fixHeader || sticky.isSticky || virtual) {
    const bodyNode = virtual ? (
      <VirtualBody
        emptyNode={emptyNode}
        holderRef={bodyRef}
        input={virtual}
        maxHeight={scrollY}
        rows={rows}
        scrollRef={virtualScrollRef}
        scrollX={scrollX}
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
            {fixFooter === 'top' && holderSummary}
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
            {holderSummary}
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

export type { StickyConfig, TableViewProps } from './viewTypes';

export default TableView;
