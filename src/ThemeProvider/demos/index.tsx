import { ThemeProvider } from '@unitalkai/ui';
import { Button } from 'antd';

export default () => {
  return (
    <ThemeProvider>
      <Button type="primary">LobeHub</Button>
    </ThemeProvider>
  );
};
