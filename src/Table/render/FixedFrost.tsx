'use client';

import * as stylex from '@stylexjs/stylex';
import { memo, type RefObject, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { PREFIX_CLS } from '../constants';
import { styles } from '../style';

const p = `.${PREFIX_CLS}`;

interface Rail {
  end: number;
  fill: boolean;
  height: number;
  host: HTMLElement;
  start: number;
  width: number;
}

const px = (value: string) => Number.parseFloat(value) || 0;

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
  const ownMatch = (selector: string) =>
    Array.from(table.querySelectorAll(selector)).some((el) => own(el));

  // Empty / skeleton body: the placeholder row spans every column, so there is nothing fixed
  // in the body and nothing scrolled under the fixed side; a rail would only blur the
  // skeleton and its row dividers.
  if (ownMatch(`${p}-placeholder`) || ownMatch('[data-table-skeleton]')) return rails;

  // useScrollSync flags the table with `*-shadow-show` exactly while content sits under a
  // fixed side; at rest the transparent fixed cells cover nothing.
  const showStart = table.classList.contains(`${PREFIX_CLS}-fix-start-shadow-show`);
  const showEnd = table.classList.contains(`${PREFIX_CLS}-fix-end-shadow-show`);
  if (!showStart && !showEnd) return rails;
  const hosts = table.querySelectorAll<HTMLElement>(
    `${p}-content, ${p}-header, ${p}-body, ${p}-tbody-virtual-holder-inner`,
  );

  for (const host of Array.from(hosts)) {
    if (!own(host)) continue;
    // A sticky header is one element and blurs itself in CSS.
    if (host.closest(`${p}-sticky-holder`)) continue;

    if (host.classList.contains(`${PREFIX_CLS}-tbody-virtual-holder-inner`)) {
      const rows = Array.from(host.querySelectorAll(`${p}-row`)).filter(
        (el) => own(el) && !el.classList.contains(`${PREFIX_CLS}-row-extra`),
      );
      const measured = measureSides(rows.slice(0, 3));
      const start = showStart ? measured.start : 0;
      const end = showEnd ? measured.end : 0;
      if (start || end) rails.push({ end, fill: true, height: 0, host, start, width: 0 });
      continue;
    }

    const tableEl = host.querySelector<HTMLTableElement>(':scope > table');
    if (!tableEl) continue;
    const rows = Array.from(tableEl.querySelectorAll(':scope > thead > tr, :scope > tbody > tr'))
      .filter((row) => !row.classList.contains(`${PREFIX_CLS}-measure-row`))
      .slice(0, 6);
    const measured = measureSides(rows);
    const start = showStart ? measured.start : 0;
    const end = showEnd ? measured.end : 0;
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

// A per-cell backdrop-filter blurs each box on its own and shows seams at every row, so
// each scroll host gets one rail holding a sticky pane per fixed side instead. A side is only
// frosted while content is scrolled under it and never over an empty / skeleton body, so row
// dividers stay continuous through fixed columns.
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
      const table = root.querySelector<HTMLElement>(p);
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
    // Consumers render Table in jsdom without a ResizeObserver polyfill.
    const resize = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(schedule);
    resize?.observe(root);
    const mutation = new MutationObserver((records) => {
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
            data-table-frost=""
            {...stylex.props(styles.frostRail)}
            style={rail.fill ? { inset: 0 } : { height: rail.height, width: rail.width }}
          >
            {rail.start > 0 && (
              <div {...stylex.props(styles.frostStart)} style={{ width: rail.start }} />
            )}
            {rail.end > 0 && <div {...stylex.props(styles.frostEnd)} style={{ width: rail.end }} />}
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
