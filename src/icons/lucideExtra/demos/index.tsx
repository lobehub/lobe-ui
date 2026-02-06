import { ActionIcon, copyToClipboard } from '@lobehub/ui';
import { message } from 'antd';

import { Flexbox } from '@/Flex';

import * as icons from '../index';

export default () => (
  <Flexbox horizontal gap={16} width="100%" wrap="wrap">
    {Object.entries(icons).map(([name, IconComponent]) => (
      <ActionIcon
        icon={IconComponent}
        key={name}
        size={24}
        title={name}
        variant={'filled'}
        onClick={async () => {
          await copyToClipboard(name);
          message.success(`Copied: ${name}`);
        }}
      />
    ))}
  </Flexbox>
);
