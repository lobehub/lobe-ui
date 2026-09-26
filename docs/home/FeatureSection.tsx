import { FeatureGrid, type FeatureGridItem } from '@lobehub/ui/awesome';
import { BookOpenText, Languages, Palette, Sparkles, SunMoon, Zap } from 'lucide-react';

import { renderLink } from './renderLink';

const FEATURES: FeatureGridItem[] = [
  {
    description:
      'Customize colors, typography, breakpoints, and other design foundations through the theme system.',
    href: '/components/theme-provider',
    icon: Palette,
    title: 'Themeable',
  },
  {
    description:
      'Avoid unnecessary style-prop processing at runtime while retaining a flexible component API.',
    icon: Zap,
    title: 'Fast',
  },
  {
    description:
      'Build interfaces that adapt consistently to light and dark appearance preferences.',
    icon: SunMoon,
    title: 'Light and dark UI',
  },
  {
    description:
      'Ship in 18 locales out of the box with I18nProvider, including RTL-aware layouts.',
    icon: Languages,
    title: 'i18n ready',
  },
  {
    description:
      'Render content-heavy pages with the bundled MDX components and typography styles.',
    icon: BookOpenText,
    title: 'MDX and docs',
  },
  {
    description:
      'Includes an AIGC-flavored icon set covering models, providers, and chat affordances.',
    icon: Sparkles,
    title: 'AIGC icons',
  },
];

export function FeatureSection() {
  return <FeatureGrid items={FEATURES} renderLink={renderLink} />;
}
