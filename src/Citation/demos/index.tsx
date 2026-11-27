import { Citation } from '@lobehub/ui';

export default () => (
  <p style={{ margin: 0 }}>
    Solar now supplies about 7% of global electricity.
    <Citation
      index={1}
      snippet="Solar generation grew by a record amount, reaching 7% of the world's electricity."
      title="Global Electricity Review 2026"
      url="https://ember-energy.org/latest-insights/global-electricity-review-2026/"
    />
    <Citation
      label="iea.org"
      title="Renewables 2026"
      url="https://www.iea.org/reports/renewables-2026"
    />
  </p>
);
