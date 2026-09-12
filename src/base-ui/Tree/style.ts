import { createStaticStyles } from 'antd-style';

import { focusRing } from '@/base-ui/focusRing';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  checkbox: css`
    margin-inline-end: 8px;
  `,
  guide: css`
    pointer-events: none;
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
    height: 100%;
    overflow: visible;

    path {
      fill: none;
      stroke: ${cssVar.colorBorderSecondary};
      stroke-width: 1;
      stroke-linecap: round;
    }
  `,
  icon: css`
    display: inline-flex;
    flex: none;
    align-items: center;
    margin-inline-end: 6px;
    color: ${cssVar.colorTextSecondary};
  `,
  node: css`
    position: relative;
    display: flex;
    align-items: center;
    border-radius: ${cssVar.borderRadius};
    color: ${cssVar.colorText};
    outline: none;
    ${focusRing}
  `,
  nodeBlock: css`
    cursor: pointer;

    &:hover {
      background: ${cssVar.colorFillTertiary};
    }

    &[aria-selected='true'] {
      background: ${cssVar.colorFillSecondary};
    }
  `,
  nodeDisabled: css`
    cursor: not-allowed;
    color: ${cssVar.colorTextDisabled};

    &:hover {
      background: transparent;
    }
  `,
  panel: css`
    height: var(--collapsible-panel-height);
    overflow: hidden;
    transition: height 200ms ${cssVar.motionEaseOut};

    &[data-starting-style],
    &[data-ending-style] {
      height: 0;
    }

    @media (prefers-reduced-motion: reduce) {
      transition-duration: 0s;
    }
  `,
  root: css`
    display: flex;
    flex-direction: column;
    user-select: none;
    outline: none;
  `,
  switcher: css`
    display: grid;
    flex: none;
    place-items: center;
    width: 24px;
    height: 24px;
    padding: 0;
    border: 0;
    border-radius: ${cssVar.borderRadiusSM};
    background: none;
    color: ${cssVar.colorTextSecondary};
    cursor: pointer;

    &:hover {
      background: ${cssVar.colorFillSecondary};
      color: ${cssVar.colorText};
    }

    svg {
      transition: transform 200ms ${cssVar.motionEaseOut};
    }

    [aria-expanded='true'] > & svg {
      transform: rotate(90deg);
    }

    @media (prefers-reduced-motion: reduce) {
      svg {
        transition-duration: 0s;
      }
    }
  `,
  switcherLeaf: css`
    visibility: hidden;
    pointer-events: none;
  `,
  title: css`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    padding-block: 2px;
    padding-inline: 6px;
    border-radius: ${cssVar.borderRadiusSM};
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  `,
  titleBlock: css`
    flex: 1;
  `,
  titleInline: css`
    cursor: pointer;

    &:hover {
      background: ${cssVar.colorFillTertiary};
    }

    [aria-selected='true'] > & {
      background: ${cssVar.colorFillSecondary};
    }

    [aria-disabled='true'] > & {
      cursor: not-allowed;
      background: transparent;
    }
  `,
}));
