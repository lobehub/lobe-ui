import { ChevronLeft } from 'lucide-react';
import { ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import ActionIcon from '@/ActionIcon';
import { DivProps } from '@/types';

import { useStyles } from './style';

export interface ChatHeaderProps extends DivProps {
  gap?: {
    left?: number;
    right?: number;
  };
  left?: ReactNode;
  onBackClick?: () => void;
  right?: ReactNode;
  showBackButton?: boolean;
}
const ChatHeader = memo<ChatHeaderProps>(
  ({ left, right, className, style, showBackButton, onBackClick, gap }) => {
    const { cx, styles } = useStyles();

    return (
      <Flexbox
        align={'center'}
        className={cx(styles.container, className)}
        distribution={'space-between'}
        horizontal
        paddingInline={16}
        style={style}
      >
        <Flexbox align={'center'} gap={gap?.left || 12} horizontal>
          {showBackButton && (
            <ActionIcon
              icon={ChevronLeft}
              onClick={() => onBackClick?.()}
              size={{ fontSize: 24 }}
              style={{ marginRight: gap?.left ? -gap.left / 2 : -6 }}
            />
          )}
          {left}
        </Flexbox>
        <Flexbox align={'center'} gap={gap?.right || 8} horizontal>
          {right}
        </Flexbox>
      </Flexbox>
    );
  },
);

export default ChatHeader;
