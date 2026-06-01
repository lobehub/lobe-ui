import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  content: css`
    display: flex;
    flex-direction: column;
    gap: 16px;

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
  `,

  scrollbar: css`
    pointer-events: none;

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
    height: 100%;
    border-radius: inherit;
    background: ${cssVar.colorTextQuaternary};
  `,

  viewport: css`
    position: relative;
    height: 100%;
    outline: none;

    &:focus-visible {
      outline: 2px solid ${cssVar.colorPrimary};
      outline-offset: 2px;
    }
  `,

  viewportFade: css`
    --scroll-area-overflow-y-start: inherit;
    --scroll-area-overflow-y-end: inherit;
    --lobe-scroll-area-fade-size: 40px;
    --lobe-scroll-area-fade-top: min(
      var(--lobe-scroll-area-fade-size),
      var(--scroll-area-overflow-y-start, 0px)
    );
    --lobe-scroll-area-fade-bottom: min(
      var(--lobe-scroll-area-fade-size),
      var(--scroll-area-overflow-y-end, 0px)
    );

    /* Fade the CONTENT via mask, so it works on background images too. */
    mask-image: linear-gradient(
      to bottom,
      transparent 0,
      #000 var(--lobe-scroll-area-fade-top),
      #000 calc(100% - var(--lobe-scroll-area-fade-bottom)),
      transparent 100%
    );
    mask-repeat: no-repeat;
    mask-size: 100% 100%;

    /* Scroll-driven animation: use scroll position to drive the mask. */
    @supports (animation-timeline: scroll()) {
      /*
       * Important: drive fade by *distance to edges* (first/last 40px),
       * so reaching top/bottom doesn't cause a sudden snap.
       */
      @keyframes lobe-scroll-area-fade-top-in {
        from {
          --lobe-scroll-area-fade-top: 0;
        }

        to {
          --lobe-scroll-area-fade-top: var(--lobe-scroll-area-fade-size);
        }
      }

      @keyframes lobe-scroll-area-fade-bottom-out {
        from {
          --lobe-scroll-area-fade-bottom: var(--lobe-scroll-area-fade-size);
        }

        to {
          --lobe-scroll-area-fade-bottom: 0;
        }
      }

      animation-name: lobe-scroll-area-fade-top-in, lobe-scroll-area-fade-bottom-out;
      animation-duration: 1ms, 1ms;
      animation-timing-function: linear, linear;
      animation-fill-mode: both, both;
      animation-timeline: scroll(self y), scroll(self y);

      animation-range:
        0 var(--lobe-scroll-area-fade-size),
        calc(100% - var(--lobe-scroll-area-fade-size)) 100%;
    }
  `,

  viewportFadeHorizontal: css`
    --scroll-area-overflow-x-start: inherit;
    --scroll-area-overflow-x-end: inherit;
    --lobe-scroll-area-fade-size: 40px;
    --lobe-scroll-area-fade-left: min(
      var(--lobe-scroll-area-fade-size),
      var(--scroll-area-overflow-x-start, 0px)
    );
    --lobe-scroll-area-fade-right: min(
      var(--lobe-scroll-area-fade-size),
      var(--scroll-area-overflow-x-end, 0px)
    );

    /* Fade the CONTENT via mask, so it works on background images too. */
    mask-image: linear-gradient(
      to right,
      transparent 0,
      #000 var(--lobe-scroll-area-fade-left),
      #000 calc(100% - var(--lobe-scroll-area-fade-right)),
      transparent 100%
    );
    mask-repeat: no-repeat;
    mask-size: 100% 100%;

    /* Scroll-driven animation: use scroll position to drive the mask. */
    @supports (animation-timeline: scroll()) {
      /*
       * Important: drive fade by *distance to edges* (first/last 40px),
       * so reaching start/end doesn't cause a sudden snap.
       */
      @keyframes lobe-scroll-area-fade-left-in {
        from {
          --lobe-scroll-area-fade-left: 0;
        }

        to {
          --lobe-scroll-area-fade-left: var(--lobe-scroll-area-fade-size);
        }
      }

      @keyframes lobe-scroll-area-fade-right-out {
        from {
          --lobe-scroll-area-fade-right: var(--lobe-scroll-area-fade-size);
        }

        to {
          --lobe-scroll-area-fade-right: 0;
        }
      }

      animation-name: lobe-scroll-area-fade-left-in, lobe-scroll-area-fade-right-out;
      animation-duration: 1ms, 1ms;
      animation-timing-function: linear, linear;
      animation-fill-mode: both, both;
      animation-timeline: scroll(self x), scroll(self x);

      animation-range:
        0 var(--lobe-scroll-area-fade-size),
        calc(100% - var(--lobe-scroll-area-fade-size)) 100%;
    }
  `,

  viewportFadeBoth: css`
    --scroll-area-overflow-x-start: inherit;
    --scroll-area-overflow-x-end: inherit;
    --scroll-area-overflow-y-start: inherit;
    --scroll-area-overflow-y-end: inherit;
    --lobe-scroll-area-fade-size: 40px;
    --lobe-scroll-area-fade-top: min(
      var(--lobe-scroll-area-fade-size),
      var(--scroll-area-overflow-y-start, 0px)
    );
    --lobe-scroll-area-fade-bottom: min(
      var(--lobe-scroll-area-fade-size),
      var(--scroll-area-overflow-y-end, 0px)
    );
    --lobe-scroll-area-fade-left: min(
      var(--lobe-scroll-area-fade-size),
      var(--scroll-area-overflow-x-start, 0px)
    );
    --lobe-scroll-area-fade-right: min(
      var(--lobe-scroll-area-fade-size),
      var(--scroll-area-overflow-x-end, 0px)
    );

    mask-composite: intersect;

    /*
     * Combine vertical + horizontal fades by intersecting two gradient masks
     * so the four corners stay transparent only when both axes overflow.
     */
    mask-image:
      linear-gradient(
        to bottom,
        transparent 0,
        #000 var(--lobe-scroll-area-fade-top),
        #000 calc(100% - var(--lobe-scroll-area-fade-bottom)),
        transparent 100%
      ),
      linear-gradient(
        to right,
        transparent 0,
        #000 var(--lobe-scroll-area-fade-left),
        #000 calc(100% - var(--lobe-scroll-area-fade-right)),
        transparent 100%
      );
    mask-repeat: no-repeat, no-repeat;
    mask-size:
      100% 100%,
      100% 100%;

    @supports (animation-timeline: scroll()) {
      @keyframes lobe-scroll-area-fade-top-in-both {
        from {
          --lobe-scroll-area-fade-top: 0;
        }

        to {
          --lobe-scroll-area-fade-top: var(--lobe-scroll-area-fade-size);
        }
      }

      @keyframes lobe-scroll-area-fade-bottom-out-both {
        from {
          --lobe-scroll-area-fade-bottom: var(--lobe-scroll-area-fade-size);
        }

        to {
          --lobe-scroll-area-fade-bottom: 0;
        }
      }

      @keyframes lobe-scroll-area-fade-left-in-both {
        from {
          --lobe-scroll-area-fade-left: 0;
        }

        to {
          --lobe-scroll-area-fade-left: var(--lobe-scroll-area-fade-size);
        }
      }

      @keyframes lobe-scroll-area-fade-right-out-both {
        from {
          --lobe-scroll-area-fade-right: var(--lobe-scroll-area-fade-size);
        }

        to {
          --lobe-scroll-area-fade-right: 0;
        }
      }

      animation-name:
        lobe-scroll-area-fade-top-in-both, lobe-scroll-area-fade-bottom-out-both,
        lobe-scroll-area-fade-left-in-both, lobe-scroll-area-fade-right-out-both;
      animation-duration: 1ms, 1ms, 1ms, 1ms;
      animation-timing-function: linear, linear, linear, linear;
      animation-fill-mode: both, both, both, both;
      animation-timeline: scroll(self y), scroll(self y), scroll(self x), scroll(self x);

      animation-range:
        0 var(--lobe-scroll-area-fade-size),
        calc(100% - var(--lobe-scroll-area-fade-size)) 100%,
        0 var(--lobe-scroll-area-fade-size),
        calc(100% - var(--lobe-scroll-area-fade-size)) 100%;
    }
  `,
}));
