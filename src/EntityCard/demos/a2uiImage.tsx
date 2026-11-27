import { EntityCard } from '@lobehub/ui';

export default () => (
  <div style={{ alignItems: 'flex-start', display: 'flex', gap: 16 }}>
    <EntityCard
      badge={{ color: 'success', label: 'In stock' }}
      description="A light pack with a padded laptop sleeve and a rain cover."
      image="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=640&q=80"
      meta="$89"
      rating={4.6}
      ratingCount={312}
      style={{ flex: 1 }}
      subtitle="Backpacks"
      title="Trailhead Daypack 22L"
      variant="a2ui"
      actions={[
        { label: 'Add to cart', variant: 'solid' },
        { label: 'Details', variant: 'outline' },
      ]}
    />
    <EntityCard
      badge={{ color: 'warning', label: 'Low stock' }}
      description="Waterproof, breathable and packs into its own pocket."
      image="https://images.unsplash.com/photo-1501554728187-ce583db33af7?w=640&q=80"
      meta="$189"
      rating={4.2}
      ratingCount={88}
      style={{ flex: 1 }}
      subtitle="Outerwear"
      title="Summit Shell Jacket"
      variant="a2ui"
      actions={[
        { label: 'Add to cart', variant: 'soft' },
        { label: 'Save', variant: 'ghost' },
      ]}
    />
  </div>
);
