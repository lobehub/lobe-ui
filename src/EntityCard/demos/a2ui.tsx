import { EntityCard } from '@lobehub/ui';

// Sample data from the A2UI playground `EntityCard` (CopilotKit standard catalog, MIT).
export default () => (
  <EntityCard
    badge={{ color: 'success', label: 'In stock' }}
    description="A light pack with a padded laptop sleeve and a rain cover."
    meta="$89"
    rating={4.6}
    ratingCount={312}
    subtitle="Backpacks"
    title="Trailhead Daypack 22L"
    variant="a2ui"
  />
);
