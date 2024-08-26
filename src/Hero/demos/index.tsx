import { Hero, HeroProps } from '@lobehub/ui';

const actions: HeroProps['actions'] = [
  {
    icon: 'Github',
    link: 'https://github.com/unitalkai',
    text: 'Github',
  },
  {
    link: '/components/action-icon',
    text: 'Get Started',
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
