import { RadioGroup } from '@lobehub/ui';

export default () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
    <RadioGroup
      defaultValue="team"
      horizontal={false}
      label="Plan"
      variant="a2ui"
      options={[
        { label: 'Free', value: 'free' },
        { description: 'Up to 30 seats', label: 'Team', value: 'team' },
        { label: 'Enterprise', value: 'enterprise' },
      ]}
    />
    <RadioGroup
      defaultValue="team"
      label="Plan"
      optionVariant="pills"
      variant="a2ui"
      options={[
        { label: 'Free', value: 'free' },
        { label: 'Team', value: 'team' },
        { label: 'Enterprise', value: 'enterprise' },
      ]}
    />
    <RadioGroup
      defaultValue="team"
      label="Plan"
      optionVariant="cards"
      variant="a2ui"
      options={[
        { description: 'For side projects', label: 'Free', value: 'free' },
        { description: 'Up to 30 seats', label: 'Team', value: 'team' },
        { description: 'SSO and SLA', label: 'Enterprise', value: 'enterprise' },
      ]}
    />
  </div>
);
