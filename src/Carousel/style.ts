import { createStaticStyles } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  arrow: css`
    position: absolute;
    z-index: 1;
    inset-block-start: 50%;
    transform: translateY(-50%);

    color: ${cssVar.colorText};

    background: ${cssVar.colorBgContainer};
    box-shadow: 0 1px 4px rgb(0 0 0 / 12%);
  `,
  dot: css`
    cursor: pointer;

    width: 6px;
    height: 6px;
    padding: 0;
    border: 0;
    border-radius: 999px;

    background: ${cssVar.colorFill};

    transition:
      width 0.2s ease,
      background 0.2s ease;

    &:hover {
      background: ${cssVar.colorTextQuaternary};
    }

    &[aria-current='true'] {
      width: 18px;
      background: ${cssVar.colorText};
    }

    &:focus-visible {
      outline: 2px solid ${cssVar.colorText};
      outline-offset: 2px;
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  `,
  dots: css`
    display: flex;
    gap: 6px;
    align-items: center;
    justify-content: center;

    padding-block: 10px;
  `,
  root: css`
    position: relative;
  `,
  slide: css`
    flex: 0 0 100%;
    min-width: 0;
  `,
  track: css`
    display: flex;
    transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  `,
  trackAdaptive: css`
    align-items: flex-start;
  `,
  viewport: css`
    touch-action: pan-y;
    position: relative;
    overflow: hidden;
    transition: height 0.3s ease;

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  `,
}));
