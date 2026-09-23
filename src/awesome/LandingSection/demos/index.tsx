import { FeatureGrid, LandingSection } from '@lobehub/ui/awesome';
import { Palette, SunMoon, Zap } from 'lucide-react';

export default () => (
  <LandingSection
    actions={[{ href: '/components/theme-provider', label: 'Theming guide' }]}
    description="Design foundations that hold up beyond the demo."
    divider={false}
    eyebrow="Why Lobe UI"
    id="demo-features"
    title="Everything an AIGC app needs"
  >
    <FeatureGrid
      items={[
        { description: 'Tune colors and type through tokens.', icon: Palette, title: 'Themeable' },
        { description: 'No runtime style-prop parsing.', icon: Zap, title: 'Fast' },
        { description: 'Light and dark out of the box.', icon: SunMoon, title: 'Appearance' },
      ]}
    />
  </LandingSection>
);
