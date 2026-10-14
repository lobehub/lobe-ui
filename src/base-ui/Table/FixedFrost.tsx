'use client';

import { memo, type RefObject, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { PREFIX_CLS, styles } from './style';

const p = `.${PREFIX_CLS}`;

interface Rail {
  end: number;
  /** Table hosts size the rail to the table; the virtual body fills its row layer. */
  fill: boolean;
  height: number;
  host: HTMLElement;
  start: number;
  width: number;
}

const px = (value: string) => Number.parseFloat(value) || 0;

/** Widths of the fixed-start / fixed-end blocks: max sticky offset + cell width over the rows. */
const measureSides = (rows: Element[]) => {
  let start = 0;
  let end = 0;
  for (const row of rows) {
    for (const cell of Array.from(row.children) as HTMLElement[]) {
      if (cell.classList.contains(`${PREFIX_CLS}-cell-fix-start`)) {
        start = Math.max(
          start,
          px(cell.style.insetInlineStart || cell.style.left) + cell.offsetWidth,
        );
      } else if (cell.classList.contains(`${PREFIX_CLS}-cell-fix-end`)) {
        end = Math.max(end, px(cell.style.insetInlineEnd || cell.style.right) + cell.offsetWidth);
      }
    }
  }
  return { end: Math.round(end), start: Math.round(start) };
};

const collectRails = (table: HTMLElement): Rail[] => {
  const rails: Rail[] = [];
  const own = (el: Element) => el.closest(p) === table;
  const hosts = table.querySelectorAll<HTMLElement>(
    `${p}-content, ${p}-header, ${p}-body, ${p}-tbody-virtual-holder-inner`,
  );

  for (const host of Array.from(hosts)) {
    if (!own(host)) continue;
    // A sticky header is frosted as one element by CSS (it is a backdrop root anyway).
    if (host.closest(`${p}-sticky-holder`)) continue;

    if (host.classList.contains(`${PREFIX_CLS}-tbody-virtual-holder-inner`)) {
      const rows = Array.from(host.children).filter(
        (el) =>
          el.classList.contains(`${PREFIX_CLS}-row`) &&
          !el.classList.contains(`${PREFIX_CLS}-row-extra`),
      );
      const { start, end } = measureSides(rows.slice(0, 3));
      if (start || end) rails.push({ end, fill: true, height: 0, host, start, width: 0 });
      continue;
    }

    const tableEl = host.querySelector<HTMLTableElement>(':scope > table');
    if (!tableEl) continue;
    const rows = Array.from(tableEl.querySelectorAll(':scope > thead > tr, :scope > tbody > tr'))
      .filter((row) => !row.classList.contains(`${PREFIX_CLS}-measure-row`))
      .slice(0, 6);
    const { start, end } = measureSides(rows);
    if (!start && !end) continue;
    rails.push({
      end,
      fill: false,
      height: tableEl.offsetHeight,
      host,
      start,
      width: tableEl.offsetWidth,
    });
  }
  return rails;
};

const sameRails = (a: Rail[], b: Rail[]) =>
  a.length === b.length &&
  a.every(
    (rail, i) =>
      rail.host === b[i].host &&
      rail.start === b[i].start &&
      rail.end === b[i].end &&
      rail.width === b[i].width &&
      rail.height === b[i].height,
  );

/**
 * One frosted backdrop per fixed side instead of one per cell. A per-cell `backdrop-filter`
 * blurs each box on its own, so the column shows seams at every row. Here a rail is portaled
 * into each scroll host (the table's scroll container, a split header / body, or the virtual
 * row layer) and holds two sticky panes spanning the fixed-start / fixed-end width and the
 * full height. The rail sits at z-index 1: above the scrolling cells (z auto), below the
 * fixed cells (z >= 2), so their dividers and content stay sharp on top of the blur.
 */
const FixedFrost = memo<{ rootRef: RefObject<HTMLElement | null> }>(({ rootRef }) => {
  const [rails, setRails] = useState<Rail[]>([]);

  // Passive effect: the root ref belongs to an ancestor and is attached after this
  // child's layout effects, so a layout effect would see it as null on mount.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const table = root.querySelector<HTMLElement>(`${p}`);
      const next = table ? collectRails(table) : [];
      for (const rail of next) {
        if (!rail.fill && getComputedStyle(rail.host).position === 'static') {
          rail.host.style.position = 'relative';
        }
      }
      setRails((prev) => (sameRails(prev, next) ? prev : next));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    // Environments without ResizeObserver (e.g. jsdom in consumer tests) still get
    // the initial measurement and DOM-mutation updates.
    const resize = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(schedule);
    resize?.observe(root);
    const mutation = new MutationObserver((records) => {
      // Ignore our own rail nodes.
      if (records.every((r) => (r.target as Element).closest?.('[data-table-frost]'))) return;
      schedule();
    });
    mutation.observe(root, { attributeFilter: ['class', 'style'], childList: true, subtree: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      resize?.disconnect();
      mutation.disconnect();
    };
  }, [rootRef]);

  return (
    <>
      {rails.map((rail, i) =>
        createPortal(
          <div
            aria-hidden
            className={styles.frostRail}
            data-table-frost=""
            style={rail.fill ? { inset: 0 } : { height: rail.height, width: rail.width }}
          >
            {rail.start > 0 && <div className={styles.frostStart} style={{ width: rail.start }} />}
            {rail.end > 0 && <div className={styles.frostEnd} style={{ width: rail.end }} />}
          </div>,
          rail.host,
          `frost-${i}`,
        ),
      )}
    </>
  );
});

FixedFrost.displayName = 'TableFixedFrost';

export default FixedFrost;
