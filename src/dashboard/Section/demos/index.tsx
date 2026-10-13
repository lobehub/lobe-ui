import { Section, Surface } from '@lobehub/ui/dashboard';

export default () => (
  <div style={{ display: 'grid', gap: 24 }}>
    <Section desc="Top models by requests" more="View all" moreLink="#models" title="Models">
      <Surface padded>Section body</Surface>
    </Section>
    <Section desc="Shown as a card" title="Card section" variant="card">
      Card body
    </Section>
  </div>
);
