import { Button, ThemeProvider } from '@lobehub/ui';
import { motion } from 'motion/react';

export default () => {
  return (
    <ThemeProvider motion={motion}>
      <Button type="primary">LobeHub</Button>
    </ThemeProvider>
  );
};
