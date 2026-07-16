import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css }) => ({
  caption: css`
    margin-block: 1rem 0;
    margin-inline: 0;
    font-size: 0.75rem;
    color: var(--docs-text-subtle);

    a {
      color: inherit;
      text-decoration: none;
      transition: color 140ms ease;

      &:hover {
        color: var(--docs-accent);
      }
    }
  `,

  item: css`
    display: inline-flex;
    gap: 0.4375rem;
    align-items: center;

    font-size: 0.8125rem;
    color: var(--docs-text-subtle);
    white-space: nowrap;
  `,

  marquee: css`
    @keyframes home-marquee-slide {
      to {
        transform: translateX(calc(-100% - 2.25rem));
      }
    }

    overflow: hidden;
    display: flex;
    gap: 2.25rem;

    width: min(100%, 40rem);

    mask-image: linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent);
  `,

  root: css`
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 100%;
    margin-block-start: 3.25rem;
  `,

  track: css`
    display: flex;
    flex: none;
    gap: 2.25rem;
    align-items: center;

    animation: home-marquee-slide 28s linear infinite;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  `,
}));
