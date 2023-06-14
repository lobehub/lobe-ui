import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Features from '@/slots/Features';
import Hero from '@/slots/Hero';

const Home = memo(() => {
  return (
    <Flexbox align={'center'} gap={80} style={{ minHeight: '60vh' }}>
      <Hero />
      <Features />
    </Flexbox>
  );
});

export default Home;
