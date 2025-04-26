import { Icon } from '@lobehub/ui';
import {
  DiscordIcon,
  GlobeOffIcon,
  LeftClickIcon,
  LeftDoubleClickIcon,
  RightClickIcon,
  RightDoubleClickIcon,
} from '@lobehub/ui/icons';
import { Flexbox } from 'react-layout-kit';

export default () => (
  <Flexbox gap={16} horizontal width="100%" wrap="wrap">
    <Icon icon={DiscordIcon} size={32} />
    <Icon icon={GlobeOffIcon} size={32} />
    <Icon icon={LeftClickIcon} size={32} />
    <Icon icon={RightClickIcon} size={32} />
    <Icon icon={LeftDoubleClickIcon} size={32} />
    <Icon icon={RightDoubleClickIcon} size={32} />
  </Flexbox>
);
