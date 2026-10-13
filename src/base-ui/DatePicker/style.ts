import { createStaticStyles } from 'antd-style';

import { focusRing } from '@/base-ui/focusRing';

/** Own prefix so rc-picker class names never collide with antd's global `.ant-picker` CSS. */
export const PREFIX_CLS = 'lobe-picker';

const P = PREFIX_CLS;
const MOTION = `${P}-slide-up`;

/**
 * Styles for rc-picker's class-name contract. `root` is passed as `rootClassName`, which
 * rc-picker puts on both the input box (`.lobe-picker`) and the popup
 * (`.lobe-picker-dropdown`); the box itself reuses base-ui Input's `rootVariants`.
 */
export const styles = createStaticStyles(({ css, cssVar }) => ({
  root: css`
    /* ---------------------------------------------------------------- input box */
    &.${P} {
      position: relative;
    }

    &.${P} .${P}-input {
      position: relative;

      display: inline-flex;
      flex: 1;
      gap: 8px;
      align-items: center;

      min-width: 0;
    }

    &.${P} .${P}-input > input {
      flex: 1;

      width: 100%;
      min-width: 0;
      padding: 0;
      border: none;

      font: inherit;
      font-variant-numeric: tabular-nums;
      color: inherit;
      text-overflow: ellipsis;

      appearance: none;
      background: transparent;
      outline: none;

      &::placeholder {
        color: ${cssVar.colorTextPlaceholder};
      }

      &:disabled {
        cursor: not-allowed;
      }
    }

    /* hover preview text from presets / cells */
    &.${P} .${P}-input-placeholder > input {
      color: ${cssVar.colorTextPlaceholder};
    }

    &.${P} .${P}-prefix {
      display: inline-flex;
      flex: none;
      align-items: center;
      color: ${cssVar.colorTextTertiary};
    }

    &.${P} .${P}-suffix {
      pointer-events: none;

      display: inline-flex;
      flex: none;
      align-items: center;
      justify-content: center;

      width: 16px;

      color: ${cssVar.colorTextTertiary};

      transition: opacity 150ms ${cssVar.motionEaseOut};
    }

    /* the clear button sits on top of the suffix icon (16px wide + 8px gap) */
    &.${P} .${P}-clear {
      cursor: pointer;

      position: relative;
      z-index: 1;

      display: inline-flex;
      flex: none;
      align-items: center;
      justify-content: center;

      width: 16px;
      height: 16px;
      margin-inline-start: -24px;
      padding: 0;
      border: 0;
      border-radius: 50%;

      color: ${cssVar.colorBgContainer};

      opacity: 0;
      background: ${cssVar.colorTextQuaternary};

      transition: opacity 150ms ${cssVar.motionEaseOut};

      &:hover {
        background: ${cssVar.colorTextTertiary};
      }
    }

    &.${P}:not(.${P}-disabled):hover .${P}-clear {
      opacity: 1;
    }

    &.${P}:not(.${P}-disabled):hover .${P}-suffix:not(:last-child) {
      opacity: 0;
    }

    &.${P}-disabled .${P}-clear {
      display: none;
    }

    /* range: two inputs, a separator and the bar under the active field */
    &.${P}-range .${P}-input {
      flex: 1;
    }

    &.${P}-range .${P}-range-separator {
      display: inline-flex;
      flex: none;
      align-items: center;
      color: ${cssVar.colorTextTertiary};
    }

    &.${P}-range .${P}-active-bar {
      pointer-events: none;

      position: absolute;
      inset-block-end: -1px;

      height: 2px;

      opacity: 0;
      background: ${cssVar.colorPrimary};

      transition:
        inset-inline-start 200ms ${cssVar.motionEaseOut},
        width 200ms ${cssVar.motionEaseOut},
        opacity 200ms ${cssVar.motionEaseOut};
    }

    &.${P}-range.${P}-focused .${P}-active-bar {
      opacity: 1;
    }

    /* ---------------------------------------------------------------- popup */
    &.${P}-dropdown {
      position: absolute;
      inset-block-start: -9999px;
      inset-inline-start: -9999px;

      font-size: 14px;
      color: ${cssVar.colorText};
    }

    &.${P}-dropdown-hidden {
      display: none;
    }

    &.${P}-dropdown .${P}-range-arrow {
      display: none;
    }

    /* rc-trigger stretches the popup to the input width; only the container is painted */
    &.${P}-dropdown .${P}-panel-container {
      overflow: hidden;
      display: inline-block;

      border-radius: 16px;

      vertical-align: top;

      background: ${cssVar.colorBgElevated};
      box-shadow: ${cssVar.boxShadow}, var(--lobe-ring);
    }

    &.${P}-dropdown .${P}-panel-layout {
      display: flex;
      align-items: stretch;
    }

    &.${P}-dropdown .${P}-panels {
      display: flex;
      flex-wrap: nowrap;
    }

    &.${P}-dropdown .${P}-panel {
      display: inline-flex;
      flex-direction: column;
      outline: none;
    }

    &.${P}-dropdown .${P}-panels > .${P}-panel + .${P}-panel {
      border-inline-start: 1px solid ${cssVar.colorBorderSecondary};
    }

    &.${P}-dropdown
      :is(
        .${P}-date-panel,
          .${P}-week-panel,
          .${P}-month-panel,
          .${P}-quarter-panel,
          .${P}-year-panel,
          .${P}-decade-panel
      ) {
      width: 288px;
    }

    /* header: << < [month year] > >> */
    &.${P}-dropdown .${P}-header {
      display: flex;
      gap: 2px;
      align-items: center;

      padding-block: 12px 4px;
      padding-inline: 12px;
    }

    &.${P}-dropdown .${P}-header > button {
      ${focusRing};
      cursor: pointer;

      display: inline-flex;
      flex: none;
      align-items: center;
      justify-content: center;

      width: 28px;
      height: 28px;
      padding: 0;
      border: 0;
      border-radius: 50%;

      color: ${cssVar.colorTextSecondary};

      background: none;

      &:hover:not(:disabled) {
        color: ${cssVar.colorText};
        background: ${cssVar.colorFillTertiary};
      }
    }

    &.${P}-dropdown
      :is(
        .${P}-header-prev-btn-disabled,
          .${P}-header-next-btn-disabled,
          .${P}-header-super-prev-btn-disabled,
          .${P}-header-super-next-btn-disabled
      ) {
      cursor: not-allowed;
      opacity: 0.3;
    }

    &.${P}-dropdown .${P}-header-view {
      display: flex;
      flex: 1;
      gap: 4px;
      align-items: center;
      justify-content: center;

      min-width: 0;

      font-weight: 600;
    }

    &.${P}-dropdown .${P}-header-view > button {
      ${focusRing};
      cursor: pointer;

      padding-block: 2px;
      padding-inline: 4px;
      border: 0;
      border-radius: 6px;

      font: inherit;
      color: inherit;

      background: none;

      &:hover:not(:disabled) {
        color: ${cssVar.colorPrimary};
      }

      &:disabled {
        cursor: default;
      }
    }

    /* body + cells */
    &.${P}-dropdown .${P}-body {
      padding-block: 4px 12px;
      padding-inline: 12px;
    }

    &.${P}-dropdown .${P}-content {
      table-layout: fixed;
      border-collapse: collapse;
      width: 100%;
    }

    &.${P}-dropdown .${P}-content th {
      height: 28px;
      padding: 0;

      font-size: 12px;
      font-weight: 400;
      color: ${cssVar.colorTextTertiary};
      text-align: center;
    }

    &.${P}-dropdown .${P}-cell {
      cursor: pointer;

      position: relative;

      padding-block: 2px;
      padding-inline: 0;

      color: ${cssVar.colorTextQuaternary};
      text-align: center;

      &::before {
        content: '';

        position: absolute;
        z-index: 0;
        inset-block-start: 50%;
        inset-inline: 0;
        transform: translateY(-50%);

        height: 32px;
      }
    }

    &.${P}-dropdown .${P}-cell-in-view {
      color: ${cssVar.colorText};
    }

    &.${P}-dropdown .${P}-cell-inner {
      position: relative;
      z-index: 1;

      display: inline-flex;
      align-items: center;
      justify-content: center;

      box-sizing: border-box;
      min-width: 32px;
      height: 32px;
      border-radius: 999px;

      font-size: 13px;
      font-variant-numeric: tabular-nums;

      transition:
        background 150ms ${cssVar.motionEaseOut},
        color 150ms ${cssVar.motionEaseOut};
    }

    &.${P}-dropdown
      .${P}-cell:not(
        .${P}-cell-disabled,
        .${P}-cell-selected,
        .${P}-cell-range-start,
        .${P}-cell-range-end
      ):hover
      .${P}-cell-inner {
      background: ${cssVar.colorFillTertiary};
    }

    &.${P}-dropdown .${P}-cell-in-view.${P}-cell-today .${P}-cell-inner {
      box-shadow: inset 0 0 0 1px ${cssVar.colorText};
    }

    &.${P}-dropdown
      :is(
        .${P}-cell-in-view.${P}-cell-selected,
          .${P}-cell-in-view.${P}-cell-range-start,
          .${P}-cell-in-view.${P}-cell-range-end
      )
      .${P}-cell-inner {
      font-weight: 600;
      color: ${cssVar.colorBgContainer};
      background: ${cssVar.colorText};
    }

    &.${P}-dropdown .${P}-cell-in-view.${P}-cell-in-range::before {
      background: ${cssVar.colorFillSecondary};
    }

    &.${P}-dropdown .${P}-cell-in-view.${P}-cell-range-start:not(.${P}-cell-range-end)::before {
      inset-inline-start: 50%;
      background: ${cssVar.colorFillSecondary};
    }

    &.${P}-dropdown .${P}-cell-in-view.${P}-cell-range-end:not(.${P}-cell-range-start)::before {
      inset-inline-end: 50%;
      background: ${cssVar.colorFillSecondary};
    }

    &.${P}-dropdown .${P}-cell-disabled {
      cursor: not-allowed;
      color: ${cssVar.colorTextQuaternary};
    }

    &.${P}-dropdown .${P}-cell-disabled::before {
      background: transparent;
    }

    /* month / quarter / year / decade: wider pills in a 3-column grid */
    &.${P}-dropdown
      :is(.${P}-month-panel, .${P}-quarter-panel, .${P}-year-panel, .${P}-decade-panel)
      .${P}-cell {
      padding-block: 8px;
    }

    &.${P}-dropdown
      :is(.${P}-month-panel, .${P}-quarter-panel, .${P}-year-panel, .${P}-decade-panel)
      .${P}-cell::before {
      height: 36px;
    }

    &.${P}-dropdown
      :is(.${P}-month-panel, .${P}-quarter-panel, .${P}-year-panel, .${P}-decade-panel)
      .${P}-cell-inner {
      min-width: 64px;
      height: 36px;
      padding-inline: 8px;
      font-size: 14px;
    }

    /* footer */
    &.${P}-dropdown .${P}-footer {
      border-block-start: 1px solid ${cssVar.colorBorderSecondary};
    }

    &.${P}-dropdown .${P}-footer-extra {
      display: flex;
      justify-content: center;
      padding-block: 12px;
      padding-inline: 12px;
    }

    &.${P}-dropdown .${P}-footer-extra + .${P}-ranges {
      border-block-start: 1px solid ${cssVar.colorBorderSecondary};
    }

    &.${P}-dropdown .${P}-ranges {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: space-between;

      margin: 0;
      padding-block: 8px;
      padding-inline: 12px;

      list-style: none;
    }

    &.${P}-dropdown .${P}-ranges > .${P}-now {
      margin-inline: auto;
    }

    &.${P}-dropdown .${P}-now-btn {
      ${focusRing};
      cursor: pointer;

      padding-block: 2px;
      padding-inline: 8px;
      border-radius: 6px;

      font-size: 13px;
      color: ${cssVar.colorText};

      &:hover {
        background: ${cssVar.colorFillTertiary};
      }
    }

    &.${P}-dropdown .${P}-now-btn-disabled {
      cursor: not-allowed;
      color: ${cssVar.colorTextQuaternary};
    }

    /* motion (transitionName = lobe-picker-slide-up) */
    &.${MOTION}-appear, &.${MOTION}-enter {
      transform-origin: top center;
    }

    &.${MOTION}-appear-start, &.${MOTION}-enter-start {
      transform: translateY(-4px) scale(0.98);
      opacity: 0;
    }

    &.${MOTION}-appear-active, &.${MOTION}-enter-active {
      transform: none;
      opacity: 1;
      transition:
        opacity 150ms ${cssVar.motionEaseOut},
        transform 150ms ${cssVar.motionEaseOut};
    }

    &.${MOTION}-leave-active {
      transform: translateY(-4px) scale(0.98);
      opacity: 0;
      transition:
        opacity 100ms ${cssVar.motionEaseInOut},
        transform 100ms ${cssVar.motionEaseInOut};
    }
  `,
}));
