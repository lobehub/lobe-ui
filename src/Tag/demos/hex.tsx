import { Flexbox, Tag } from '@lobehub/ui';
import { BadgeCheckIcon } from 'lucide-react';

export default () => {
  return (
    <Flexbox gap={8} padding={16}>
      <Flexbox horizontal gap={8} wrap="wrap">
        <Tag icon={<BadgeCheckIcon size={14} />} variant="outlined">
          outlined
        </Tag>
        <Tag color="#1677ff" icon={<BadgeCheckIcon size={14} />} variant="outlined">
          hex outlined
        </Tag>
        <Tag color="#1677ff" icon={<BadgeCheckIcon size={14} />} variant="filled">
          hex filled
        </Tag>
        <Tag color="#1677ff" icon={<BadgeCheckIcon size={14} />} variant="solid">
          hex solid
        </Tag>
        <Tag color="#1677ff" icon={<BadgeCheckIcon size={14} />} variant="borderless">
          hex borderless
        </Tag>
      </Flexbox>
    </Flexbox>
  );
};
