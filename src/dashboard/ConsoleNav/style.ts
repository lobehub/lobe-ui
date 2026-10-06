import { createStaticStyles } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar, responsive }) => {
  // Fades out at once on collapse, but waits on expand until the width has room for the text.
  const railFade = `
    transition: opacity 120ms ease 80ms;

    [data-collapsed='true'] & {
      opacity: 0;
      transition-delay: 0s;
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  `;

  return {
    badge: css`
      flex: none;

      min-inline-size: 20px;
      padding-inline: 6px;
      border-radius: 999px;

      font-size: ${cssVar.fontSizeSM};
      font-variant-numeric: tabular-nums;
      color: ${cssVar.colorError};
      text-align: center;

      background: color-mix(in srgb, ${cssVar.colorError} 12%, transparent);

      ${railFade}
    `,
    chevron: css`
      flex: none;
      transition:
        transform 160ms ease,
        opacity 120ms ease 80ms;

      &[data-expanded='false'] {
        transform: rotate(-90deg);
      }

      [data-collapsed='true'] & {
        opacity: 0;
        transition-delay: 0s;
      }

      @media (prefers-reduced-motion: reduce) {
        transition: none;
      }
    `,
    indicator: css`
      display: flex;
      flex: none;
      align-items: center;
      justify-content: center;

      width: 18px;
      height: 18px;
      margin-inline-start: -6px;

      color: ${cssVar.colorTextDescription};

      transition: transform 160ms ease;

      &[data-expanded='true'] {
        transform: rotate(90deg);
      }
    `,
    dot: css`
      position: absolute;
      inset-block-start: 7px;
      inset-inline-end: 9px;

      inline-size: 7px;
      block-size: 7px;
      border-radius: 999px;

      opacity: 0;
      background: ${cssVar.colorError};

      transition: opacity 120ms ease;

      [data-collapsed='true'] & {
        opacity: 1;
      }

      @media (prefers-reduced-motion: reduce) {
        transition: none;
      }
    `,
    fold: css`
      display: grid;
      grid-template-rows: 1fr;
      transition:
        grid-template-rows 200ms ease,
        margin 200ms ease,
        opacity 120ms ease;

      > div {
        overflow: hidden;
        min-block-size: 0;
      }

      &[data-folded='true'] {
        grid-template-rows: 0fr;
        opacity: 0;
      }

      &[data-folded='true']:not(:first-child) {
        margin-block-start: -2px;
      }

      @media (prefers-reduced-motion: reduce) {
        transition: none;
      }
    `,
    group: css`
      position: relative;

      display: flex;
      flex-direction: column;

      margin-block-start: 12px;

      transition: margin 200ms ease;

      &::before {
        content: '';

        position: absolute;
        inset-block-start: -6px;
        inset-inline: 0;

        block-size: 1px;

        opacity: 0;
        background: ${cssVar.colorBorderSecondary};

        transition: opacity 200ms ease;
      }

      &[data-level='0'][data-icon='true'] {
        margin-block-start: 2px;
      }

      &:not([data-level='0']) {
        margin-block-start: 6px;
      }

      [data-collapsed='true'] & + &[data-level='0'][data-icon='false']::before {
        opacity: 1;
      }

      [data-collapsed='true'] &[data-rail-empty='true'] {
        margin-block-start: 0;

        &::before {
          opacity: 0;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        transition: none;

        &::before {
          transition: none;
        }
      }
    `,
    groupHead: css`
      position: relative;
      display: flex;
      flex-direction: column;
    `,
    groupHeader: css`
      cursor: pointer;

      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: space-between;

      min-block-size: 32px;
      padding-inline: 10px;
      border: none;
      border-radius: ${cssVar.borderRadius};

      font-size: ${cssVar.fontSizeSM};
      font-weight: 500;
      color: ${cssVar.colorTextSecondary};
      text-align: start;
      white-space: nowrap;

      background: none;

      &:hover,
      &[data-active='true'] {
        color: ${cssVar.colorText};
      }

      &[data-icon='true'] {
        gap: 10px;
        justify-content: flex-start;
        min-block-size: 36px;
        font-size: ${cssVar.fontSize};

        > [role='img'] {
          justify-content: center;
          inline-size: 18px;
        }
      }

      &[data-level='0'][data-icon='true']:hover {
        background: ${cssVar.colorFillTertiary};
      }

      /* Nested groups read as quiet subheadings with the indicator right after the label. */
      &:not([data-level='0']) {
        gap: 8px;
        justify-content: flex-start;

        min-block-size: 26px;

        font-size: ${cssVar.fontSizeSM};
        font-weight: 400;
        color: ${cssVar.colorTextDescription};

        > [data-label] {
          flex: 0 1 auto;
        }

        &:hover,
        &[data-active='true'] {
          color: ${cssVar.colorTextSecondary};
        }
      }

      &[data-indent='1'] {
        padding-inline-start: 38px;
      }

      &[data-indent='2'] {
        padding-inline-start: 56px;
      }

      > [role='img'] {
        display: flex;
        flex: none;
      }
    `,
    groupItems: css`
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-block-size: 0;
    `,
    groupPanel: css`
      display: grid;
      grid-template-rows: 1fr;
      transition: grid-template-rows 160ms ease;

      > div {
        overflow: hidden;
      }

      &[data-expanded='false'] {
        grid-template-rows: 0fr;
      }

      &[data-instant='true'] {
        transition: none;
      }
    `,
    item: css`
      position: relative;

      display: flex;
      gap: 10px;
      align-items: center;

      min-block-size: 36px;
      padding-inline: 10px;
      border-radius: ${cssVar.borderRadius};

      color: ${cssVar.colorTextSecondary};
      text-decoration: none;
      white-space: nowrap;

      transition:
        background 120ms ease,
        color 120ms ease;

      &:hover {
        color: ${cssVar.colorText};
        background: ${cssVar.colorFillTertiary};
      }

      &[data-active='true'] {
        font-weight: 500;
        color: ${cssVar.colorText};
        background: ${cssVar.colorFillSecondary};
      }

      &[data-indent='1'],
      &[data-indent='2'] {
        min-block-size: 32px;
        color: ${cssVar.colorText};
      }

      &[data-indent='1'] {
        padding-inline-start: 38px;
      }

      &[data-indent='2'] {
        padding-inline-start: 56px;
      }

      [data-collapsed='true'] &:not([data-indent='0']) {
        padding-inline-start: 10px;
      }

      > [role='img'] {
        display: flex;
        flex: none;
      }

      ${responsive.mobile} {
        min-block-size: 44px;
      }
    `,
    itemLabel: css`
      overflow: hidden;
      flex: 1;
      text-overflow: ellipsis;
      white-space: nowrap;

      [data-collapsed='true'] & {
        text-overflow: clip;
      }

      ${railFade}
    `,
    nav: css`
      /* Scroll anchoring would jump the list in one frame while rail rows fold and unfold. */
      overflow-anchor: none;
      scrollbar-width: thin;

      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 2px;

      min-block-size: 0;
      padding-block-end: 12px;
      padding-inline: 8px;
    `,
    railLink: css`
      position: absolute;
      inset: 0;
      border-radius: ${cssVar.borderRadius};
      transition: background 120ms ease;

      &:hover {
        background: ${cssVar.colorFillTertiary};
      }

      &[data-active='true'] {
        background: ${cssVar.colorFillSecondary};
      }

      @starting-style {
        background: transparent;
      }
    `,
    topItems: css`
      display: flex;
      flex-direction: column;
      gap: 2px;
      transition:
        margin 200ms ease,
        padding 200ms ease,
        border-color 200ms ease;

      &[data-divided='true'] {
        margin-block-end: 6px;
        padding-block-end: 8px;
        border-block-end: 1px solid ${cssVar.colorBorderSecondary};
      }

      [data-collapsed='true'] &[data-rail-empty='true'] {
        margin-block-end: 0;
        padding-block-end: 0;
        border-block-end-color: transparent;
      }

      @media (prefers-reduced-motion: reduce) {
        transition: none;
      }
    `,
  };
});
