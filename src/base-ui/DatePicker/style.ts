import { focusRing } from '@/base-ui/focusRing';
import { createStaticStyles } from '@/utils/styleEngine';

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
  /** antd's `underlined`: only a bottom border, applied over Input's `borderless`. */
  underlined: css`
    &.${P} {
      border-block-end-color: ${cssVar.colorBorder};
      border-radius: 0;
    }

    &.${P}:hover:not(:focus-within, .${P}-disabled) {
      border-block-end-color: ${cssVar.colorPrimaryHover};
    }

    &.${P}:focus-within {
      border-block-end-color: ${cssVar.colorPrimary};
    }
  `,
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

    /*
     * \`disabled: [boolean, boolean]\`: Input greys the whole root on \`:has(input:disabled)\`;
     * while one end stays editable (rc adds \`-disabled\` only when both are), grey just that end.
     */
    &.${P}-range:not(.${P}-disabled):has(input:disabled) {
      cursor: auto;
      color: ${cssVar.colorText};
      opacity: 1;
    }

    &.${P}-range:not(.${P}-disabled) .${P}-input:has(> input:disabled) {
      cursor: not-allowed;
      color: ${cssVar.colorTextQuaternary};
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

    /* status: border + focus ring per variant, as antd's genStatusStyle */
    &.${P}-status-error {
      --lobe-picker-status: ${cssVar.colorError};
      --lobe-picker-status-hover: ${cssVar.colorErrorBorderHover};
      --lobe-picker-status-bg: ${cssVar.colorErrorBg};
      --lobe-picker-status-bg-hover: ${cssVar.colorErrorBgHover};
    }

    &.${P}-status-warning {
      --lobe-picker-status: ${cssVar.colorWarning};
      --lobe-picker-status-hover: ${cssVar.colorWarningBorderHover};
      --lobe-picker-status-bg: ${cssVar.colorWarningBg};
      --lobe-picker-status-bg-hover: ${cssVar.colorWarningBgHover};
    }

    &:is(.${P}-status-error, .${P}-status-warning):not(.${P}-disabled) {
      &.${P}-outlined {
        border-color: var(--lobe-picker-status);

        &:hover:not(:focus-within) {
          border-color: var(--lobe-picker-status-hover);
        }

        &:focus-within {
          border-color: var(--lobe-picker-status);
          box-shadow: 0 0 0 2px var(--lobe-picker-status-bg);
        }
      }

      &.${P}-filled {
        background: var(--lobe-picker-status-bg);

        &:hover:not(:focus-within) {
          background: var(--lobe-picker-status-bg-hover);
        }

        &:focus-within {
          border-color: var(--lobe-picker-status);
          background: ${cssVar.colorBgContainer};
        }
      }

      &.${P}-underlined {
        border-block-end-color: var(--lobe-picker-status);
      }

      &:is(.${P}-borderless, .${P}-underlined) .${P}-input > input {
        color: var(--lobe-picker-status);
      }

      .${P}-prefix {
        color: var(--lobe-picker-status);
      }
    }

    /* rtl: rc-picker adds the -rtl modifier to the box and the popup; lucide arrows are mirrored */
    &.${P}-rtl, &.${P}-dropdown-rtl {
      direction: rtl;
    }

    &.${P}-rtl .${P}-range-separator .lucide,
    &.${P}-dropdown-rtl .${P}-header > button .lucide {
      transform: scaleX(-1);
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
      /* nested in a base-ui Modal / Popover layer that sets pointer-events: none */
      pointer-events: auto;

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

    /* presets: a sidebar on the start side of the panels, as in antd */
    &.${P}-dropdown .${P}-presets {
      display: flex;
      flex-direction: column;
      min-width: 120px;
      max-width: 200px;

      ul {
        overflow: auto;
        flex: auto;

        height: 0;
        margin: 0;
        padding: 6px;
        border-inline-end: 1px solid ${cssVar.colorBorderSecondary};

        list-style: none;
      }

      li {
        cursor: pointer;

        overflow: hidden;

        padding-block: 4px;
        padding-inline: 8px;
        border-radius: 6px;

        font-size: 13px;
        line-height: 20px;
        color: ${cssVar.colorText};
        text-overflow: ellipsis;
        white-space: nowrap;

        transition: background-color 150ms ${cssVar.motionEaseOut};

        &:hover {
          background: ${cssVar.colorFillTertiary};
        }
      }

      li + li {
        margin-block-start: 2px;
      }
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

    /* decade labels ("2020-2029") stay on one line */
    &.${P}-dropdown .${P}-decade-panel .${P}-cell-inner {
      padding-inline: 6px;
      font-size: 13px;
      white-space: nowrap;
    }

    /* week number column: always on the week panel, on the date panel with showWeek */
    &.${P}-dropdown :is(.${P}-week-panel, .${P}-date-panel-show-week) {
      width: 320px;
    }

    &.${P}-dropdown .${P}-cell-week {
      font-size: 12px;
      color: ${cssVar.colorTextTertiary};
    }

    &.${P}-dropdown .${P}-date-panel-show-week .${P}-cell-week {
      cursor: default;
    }

    /* week panel: the whole row is one tile, painted through each cell's band */
    &.${P}-dropdown .${P}-week-panel .${P}-cell:hover .${P}-cell-inner {
      background: none;
    }

    &.${P}-dropdown .${P}-week-panel .${P}-cell:first-child::before {
      inset-inline-start: 2px;
      border-start-start-radius: 999px;
      border-end-start-radius: 999px;
    }

    &.${P}-dropdown .${P}-week-panel .${P}-cell:last-child::before {
      inset-inline-end: 2px;
      border-start-end-radius: 999px;
      border-end-end-radius: 999px;
    }

    &.${P}-dropdown .${P}-week-panel-row:hover .${P}-cell::before {
      background: ${cssVar.colorFillTertiary};
    }

    &.${P}-dropdown
      .${P}-week-panel-row-range-hover
      .${P}-cell::before,
      &.${P}-dropdown
      .${P}-week-panel-row-hover
      .${P}-cell::before {
      background: ${cssVar.colorFillSecondary};
    }

    &.${P}-dropdown
      :is(
        .${P}-week-panel-row-selected,
          .${P}-week-panel-row-range-start,
          .${P}-week-panel-row-range-end
      )
      .${P}-cell {
      color: ${cssVar.colorBgContainer};

      &::before {
        background: ${cssVar.colorText};
      }

      .${P}-cell-inner {
        font-weight: 600;
        box-shadow: none;
      }
    }

    /* keyboard: the tile arrow keys moved to on month / quarter / year / decade panels */
    &.${P}-dropdown .${P}-cell-keyboard-active {
      display: none;
    }

    &.${P}-dropdown .${P}-cell-in-view:has(> .${P}-cell-keyboard-active) .${P}-cell-inner {
      outline: 2px solid ${cssVar.colorPrimary};
      outline-offset: 1px;
    }

    /* time: hour / minute / second / meridiem columns, beside the date panel with showTime */
    &.${P}-dropdown .${P}-datetime-panel {
      display: flex;
      align-items: stretch;
    }

    &.${P}-dropdown .${P}-datetime-panel > .${P}-time-panel {
      border-inline-start: 1px solid ${cssVar.colorBorderSecondary};
    }

    &.${P}-dropdown .${P}-time-panel {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    &.${P}-dropdown .${P}-time-panel .${P}-header-view {
      height: 28px;
      font-variant-numeric: tabular-nums;
    }

    &.${P}-dropdown .${P}-time-panel .${P}-content {
      display: flex;
      flex: auto;

      height: 224px;
      padding-block: 4px 12px;
      padding-inline: 4px;
    }

    /* next to the date panel the columns take its height instead */
    &.${P}-dropdown .${P}-datetime-panel .${P}-time-panel .${P}-content {
      flex: 1 1 0;
      height: auto;
      min-height: 0;
    }

    &.${P}-dropdown .${P}-time-panel-column {
      scrollbar-width: thin;

      overflow-y: hidden;
      flex: none;

      width: 56px;
      margin: 0;
      padding: 0;

      list-style: none;

      /* lets the last option scroll up to the top, as in antd */
      &::after {
        content: '';
        display: block;
        height: calc(100% - 28px);
      }

      &:hover {
        overflow-y: auto;
      }
    }

    &.${P}-dropdown .${P}-time-panel-column + .${P}-time-panel-column {
      border-inline-start: 1px solid ${cssVar.colorBorderSecondary};
    }

    &.${P}-dropdown .${P}-time-panel-cell {
      cursor: pointer;
      padding-block: 1px;
      padding-inline: 4px;
    }

    &.${P}-dropdown .${P}-time-panel-cell-inner {
      height: 26px;
      border-radius: 6px;

      font-size: 13px;
      font-variant-numeric: tabular-nums;
      line-height: 26px;
      color: ${cssVar.colorText};
      text-align: center;

      transition:
        background 150ms ${cssVar.motionEaseOut},
        color 150ms ${cssVar.motionEaseOut};
    }

    &.${P}-dropdown
      .${P}-time-panel-cell:not(.${P}-time-panel-cell-disabled, .${P}-time-panel-cell-selected):hover
      .${P}-time-panel-cell-inner {
      background: ${cssVar.colorFillTertiary};
    }

    &.${P}-dropdown .${P}-time-panel-cell-selected .${P}-time-panel-cell-inner {
      font-weight: 600;
      color: ${cssVar.colorBgContainer};
      background: ${cssVar.colorText};
    }

    &.${P}-dropdown .${P}-time-panel-cell-disabled {
      cursor: not-allowed;

      .${P}-time-panel-cell-inner {
        color: ${cssVar.colorTextQuaternary};
      }
    }

    /* footer */
    &.${P}-dropdown .${P}-footer {
      border-block-start: 1px solid ${cssVar.colorBorderSecondary};
    }

    /* renderExtraFooter: start-aligned above Today / Now / OK, as in antd */
    &.${P}-dropdown .${P}-footer-extra {
      padding-block: 8px;
      padding-inline: 12px;

      font-size: 13px;
      line-height: 20px;
      color: ${cssVar.colorTextSecondary};
      text-align: start;
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

    /* Now on the start side, OK on the end side */
    &.${P}-dropdown .${P}-ranges > .${P}-now:has(+ .${P}-ok) {
      margin-inline: 0;
    }

    &.${P}-dropdown .${P}-ranges > .${P}-ok {
      margin-inline-start: auto;
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
