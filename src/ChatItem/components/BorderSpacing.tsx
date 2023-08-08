import { memo } from 'react';

import { ChatItemProps } from '@/ChatItem';

export interface BorderSpacingProps {
  borderSpacing?: ChatItemProps['borderSpacing'];
}

const BorderSpacing = memo<BorderSpacingProps>(({ borderSpacing }) => {
  if (!borderSpacing) return null;

  return <div style={{ flex: 'none', width: borderSpacing }} />;
});

export default BorderSpacing;
