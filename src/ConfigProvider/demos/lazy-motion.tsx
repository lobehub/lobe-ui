import { ConfigProvider } from '@lobehub/ui';
import { domAnimation,LazyMotion } from 'motion/react';
import * as m from 'motion/react-m';

const App = () => (
  <m.div
    animate={{ opacity: 1, scale: 1 }}
    initial={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.3 }}
  >
    Your App Content
  </m.div>
);

export default () => (
  <LazyMotion features={domAnimation}>
    <ConfigProvider motion={m}>
      <App />
    </ConfigProvider>
  </LazyMotion>
);
