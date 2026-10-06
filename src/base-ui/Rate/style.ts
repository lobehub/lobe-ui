import { createStaticStyles } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  empty: css`
    /* Group opacity instead of the translucent colorFill so the star's stroke and fill don't double up where they overlap. */
    color: ${cssVar.colorText};
    opacity: 0.12;
  `,
  fill: css`
    pointer-events: none;

    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;

    overflow: hidden;
    display: flex;
  `,
  half: css`
    position: absolute;
    inset-block: 0;
    width: 50%;

    &[data-half='start'] {
      inset-inline-start: 0;
    }

    &[data-half='end'] {
      inset-inline-end: 0;
    }
  `,
  icon: css`
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
  `,
  root: css`
    display: inline-flex;
    align-items: center;
    line-height: 1;
    outline: none;

    &[role='slider'] {
      cursor: pointer;
    }

    &[role='slider']:focus-visible {
      border-radius: 4px;
      outline: 2px solid ${cssVar.colorText};
      outline-offset: 2px;
    }

    &[aria-disabled='true'] {
      cursor: not-allowed;
      opacity: 0.5;
    }
  `,
  star: css`
    position: relative;

    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;

    transition: transform 0.15s ease;

    [role='slider']:not([aria-disabled='true']) > &:hover {
      transform: scale(1.1);
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  `,
}));
