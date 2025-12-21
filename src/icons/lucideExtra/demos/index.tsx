import { ActionIcon, copyToClipboard } from '@lobehub/ui';
import { message } from 'antd';

import { Flexbox } from '@/Flex';

import * as icons from '../index';

export default () => (
  <Flexbox gap={16} horizontal width="100%" wrap="wrap">
    {Object.entries(icons).map(([name, IconComponent]) => (
      <ActionIcon
        icon={IconComponent}
        key={name}
        onClick={async () => {
          await copyToClipboard(name);
          message.success(`Copied: ${name}`);
        }}
        size={24}
        title={name}
        variant={'filled'}
      />
    ))}
  </Flexbox>
);
