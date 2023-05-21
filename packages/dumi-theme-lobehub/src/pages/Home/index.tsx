import { Helmet } from 'dumi';
import { memo, type FC } from 'react';
import { Flexbox } from 'react-layout-kit';

import Features from 'dumi/theme/slots/Features';
import Footer from 'dumi/theme/slots/Footer';
import Header from 'dumi/theme/slots/Header';
import Hero from 'dumi/theme/slots/Hero';

import { siteTitleSel, useSiteStore } from '../../store';

const Home: FC = memo(() => {
  const siteTitle = useSiteStore(siteTitleSel);

  return (
    <>
      <Helmet>
        <title>{siteTitle}</title>
      </Helmet>
      <Flexbox align={'center'} gap={80}>
        <Header />
        <Hero />
        <Features />
        <Footer />
      </Flexbox>
    </>
  );
});

export default Home;
