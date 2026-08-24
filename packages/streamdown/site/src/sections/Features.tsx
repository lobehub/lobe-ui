const FEATURES = [
  {
    description: 'Character or word granularity with three cadence presets.',
    icon: <path d="M4 12h4l3-7 4 14 3-7h2" />,
    title: 'Smooth reveal',
  },
  {
    description: 'Finished blocks memoize. Only the tail block re-renders.',
    icon: (
      <>
        <rect height="5" rx="1.5" width="18" x="3" y="4" />
        <rect height="5" opacity="0.45" rx="1.5" width="18" x="3" y="12" />
      </>
    ),
    title: 'Block cache',
  },
  {
    description: 'Unbalanced delimiters stay inert until the stream closes them.',
    icon: <path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6z" />,
    title: 'LaTeX guard',
  },
  {
    description: 'No stylesheet, no component dependencies. Bring your own CSS.',
    icon: <path d="M9 5H5v4M15 5h4v4M9 19H5v-4M15 19h4v-4" />,
    title: 'Headless',
  },
];

export const Features = () => (
  <section className="features">
    {FEATURES.map(({ description, icon, title }) => (
      <div className="feature" key={title}>
        <svg
          aria-hidden
          fill="none"
          height="18"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.6"
          viewBox="0 0 24 24"
          width="18"
        >
          {icon}
        </svg>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    ))}
  </section>
);
