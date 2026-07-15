import { ConfigProvider } from '@lobehub/ui';
import { motion } from 'motion/react';

const App = () => (
  <motion.div
    animate={{ opacity: 1, y: 0 }}
    initial={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.5 }}
  >
    Your App Content
  </motion.div>
);

export default () => (
  <ConfigProvider motion={motion}>
    <App />
  </ConfigProvider>
);
