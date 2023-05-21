import { App } from 'antd';

import { ThemeProvider, ThemeProviderProps } from './ThemeProvider';

export default ({ children, ...props }: ThemeProviderProps) => {
  return (
    <ThemeProvider {...props}>
      <App>{children}</App>
    </ThemeProvider>
  );
};

export * from './ThemeProvider';
