import { FeatureGrid } from '@lobehub/ui/awesome';
import { Languages, Palette, SunMoon } from 'lucide-react';

export default () => (
  <FeatureGrid
    items={[
      {
        description: 'Customize colors, typography and breakpoints through the theme system.',
        icon: Palette,
        title: 'Themeable',
      },
      {
        description: 'Adapt consistently to light and dark appearance preferences.',
        icon: SunMoon,
        title: 'Light and dark UI',
      },
      {
        description: 'Ship in 18 locales with I18nProvider, including RTL layouts.',
        href: '/components/i18n',
        icon: Languages,
        title: 'i18n ready',
      },
    ]}
  />
);
