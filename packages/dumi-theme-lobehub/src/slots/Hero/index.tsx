import HeroComp from '@/components/Hero';
import { heroActionsSel, heroDescSel, heroTitleSel, useSiteStore } from '@/store';
import { memo } from 'react';

const Hero = memo(() => {
  const title = useSiteStore(heroTitleSel);
  const description = useSiteStore(heroDescSel);
  const actions = useSiteStore(heroActionsSel);

  return <HeroComp title={title!} actions={actions} description={description} />;
});

export default Hero;
