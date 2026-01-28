import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  content: css`
    display: flex;
    flex-direction: column;
    gap: 16px;

    padding-block: 12px;
    padding-inline: 16px 24px;

    font-size: ${cssVar.fontSizeSM};
    line-height: 1.375rem;
    color: ${cssVar.colorText};
  `,

  corner: css`
    background: ${cssVar.colorFillSecondary};
  `,

  root: css`
    position: relative;
    box-sizing: border-box;
    border-radius: ${cssVar.borderRadiusLG};
    background: ${cssVar.colorBgLayout};
  `,

  scrollbar: css`
    pointer-events: none;

    position: relative;

    display: flex;
    justify-content: center;

    margin: 8px;
    border-radius: ${cssVar.borderRadiusSM};

    opacity: 0;
    background: transparent;

    transition: opacity 150ms;

    &::before {
      content: '';
      position: absolute;
    }

    &[data-scrolling] {
      transition-duration: 0ms;
    }

    &[data-hovering],
    &[data-scrolling] {
      pointer-events: auto;
      opacity: 1;
    }

    &[data-orientation='vertical'] {
      width: 4px;

      &::before {
        inset-inline-start: 50%;
        transform: translateX(-50%);
        width: 20px;
        height: 100%;
      }
    }

    &[data-orientation='horizontal'] {
      height: 4px;

      &::before {
        inset-block-end: -8px;
        inset-inline: 0;
        width: 100%;
        height: 20px;
      }
    }
  `,

  thumb: css`
    width: 100%;
    border-radius: inherit;
    background: ${cssVar.colorTextQuaternary};
  `,

  viewport: css`
    position: relative;

    height: 100%;
    border-radius: ${cssVar.borderRadius};

    background: ${cssVar.colorBgLayout};
    outline: none;

    &:focus-visible {
      outline: 2px solid ${cssVar.colorPrimary};
      outline-offset: 2px;
    }
  `,

  viewportFade: css`
    &::before,
    &::after {
      pointer-events: none;
      content: '';

      position: sticky;
      z-index: 1;
      inset-inline-start: 0;

      display: block;

      width: 100%;
      border-radius: ${cssVar.borderRadius};

      transition: height 0.1s ease-out;
    }

    &::before {
      --scroll-area-overflow-y-start: inherit;

      inset-block-start: 0;
      height: min(40px, var(--scroll-area-overflow-y-start));
      background: linear-gradient(to bottom, ${cssVar.colorBgLayout}, transparent);
    }

    &::after {
      --scroll-area-overflow-y-end: inherit;

      inset-block-end: 0;
      height: min(40px, var(--scroll-area-overflow-y-end, 40px));
      background: linear-gradient(to top, ${cssVar.colorBgLayout}, transparent);
    }
  `,
}));
