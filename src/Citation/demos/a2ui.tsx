import { Citation } from '@lobehub/ui';

// Inline sources in the A2UI playground style (CopilotKit standard `Citation`, MIT).
export default () => (
  <div style={{ alignItems: 'center', display: 'flex', gap: 4 }}>
    <span>Solar now supplies about 7% of global electricity.</span>
    <Citation
      index={1}
      snippet="Solar generation grew by a record amount, reaching 7% of the world's electricity."
      title="Global Electricity Review 2026"
      url="https://ember-energy.org/latest-insights/global-electricity-review-2026/"
      variant="a2ui"
    />
    <Citation
      label="iea.org"
      title="Renewables 2026"
      url="https://www.iea.org/reports/renewables-2026"
      variant="a2ui"
    />
  </div>
);
