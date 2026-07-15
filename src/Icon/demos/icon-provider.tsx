import { Icon, IconProvider } from '@lobehub/ui';
import { PlusCircle, Settings } from 'lucide-react';

export default () => (
  <IconProvider config={{ color: 'red', size: 'large' }}>
    <Icon icon={PlusCircle} />
    <Icon icon={Settings} />
  </IconProvider>
);
