import { EntityCard } from '@lobehub/ui';

export default () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <EntityCard
      badge={{ color: 'discovery', label: 'Popular' }}
      description="Country loaves, morning buns and seasonal tarts. Expect a line on weekends."
      href="https://example.com/tartine"
      image="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=640&q=80"
      layout="horizontal"
      meta="Open until 19:00"
      rating={4.7}
      ratingCount={5120}
      subtitle="Bakery · Mission District"
      title="Tartine Bakery"
      variant="a2ui"
    />
    <EntityCard
      badge={{ color: 'info', label: 'In progress' }}
      description="1 commit · 12 files · +608 / −98 · 65 behind main. Rebase and push the review forward, or close it."
      href="https://github.com"
      layout="horizontal"
      meta="No updates since 11-23 (4 days)"
      subtitle="PR #223 open"
      title="feat/in-app-login-window"
      variant="a2ui"
    />
  </div>
);
