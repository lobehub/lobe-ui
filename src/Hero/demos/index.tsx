import { Hero, HeroProps } from '@lobehub/ui';

const actions: HeroProps['actions'] = [
  {
    text: 'Github',
    icon: 'Github',
    link: 'https://github.com/lobehub',
  },
  {
    text: 'Get Started',
    link: '/components/action-icon',
    type: 'primary',
  },
];

export default () => {
  return (
    <Hero
      actions={actions}
      description="Lobe UI is an open-source UI component library for <br/>building chatbot web apps"
      title="Lobe <b>UI</b>"
    />
  );
};
