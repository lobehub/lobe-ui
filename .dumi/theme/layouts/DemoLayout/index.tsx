import { ThemeProvider } from '@/index';
import { useOutlet, usePrefersColor } from 'dumi';
import React from 'react';

const DemoLayot: React.FC = () => {
  const [color] = usePrefersColor();
  const outlet = useOutlet();
  return <ThemeProvider appearance={color}>{outlet}</ThemeProvider>;
};

export default DemoLayot;
