import { type FC } from 'react';

import HeroComp from '@/components/Hero';

import { heroActionsSel, heroDescSel, heroTitleSel, useSiteStore } from '@/store';

const Hero: FC = () => {
  const title = useSiteStore(heroTitleSel);
  const description = useSiteStore(heroDescSel);
  const actions = useSiteStore(heroActionsSel);

  return <HeroComp title={title!} actions={actions} description={description} />;
};

export default Hero;
