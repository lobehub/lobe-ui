import { LandingHero } from '@lobehub/ui/awesome';
import { GithubIcon } from '@lobehub/ui/icons';
import { ArrowRight } from 'lucide-react';

export default () => (
  <LandingHero
    accent="UI Kit"
    badge="New · Landing components"
    description="An open-source React component library for building AIGC web apps."
    title="LobeHub"
    actions={[
      {
        href: '/components/button',
        icon: ArrowRight,
        iconPlacement: 'end',
        label: 'Get Started',
        primary: true,
      },
      { href: 'https://github.com/lobehub/lobe-ui', icon: GithubIcon, label: 'GitHub' },
    ]}
  />
);
