import { Hero as H } from '@lobehub/ui';
import { memo } from 'react';

import { heroActionsSel, heroDescSel, heroTitleSel, useSiteStore } from '@/store';

const Hero = memo(() => {
  const title = useSiteStore(heroTitleSel);
  const description = useSiteStore(heroDescSel);
  const actions = useSiteStore(heroActionsSel);

  return <H actions={actions} description={description} title={title!} />;
});

export default Hero;
