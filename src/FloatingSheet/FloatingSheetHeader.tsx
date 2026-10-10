import * as stylex from '@stylexjs/stylex';
import { type ReactNode } from 'react';

import { styles } from './style';

interface FloatingSheetHeaderProps {
  handleProps: {
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  };
  headerActions?: ReactNode;
  isDragging: boolean;
  title?: ReactNode;
}

export function FloatingSheetHeader({
  title,
  headerActions,
  isDragging,
  handleProps,
}: FloatingSheetHeaderProps) {
  const s = styles;

  return (
    <div {...stylex.props(s.header, isDragging && s.headerDragging)} {...handleProps}>
      <div {...stylex.props(s.handle)} />
      <div {...stylex.props(s.headerContent)}>
        {title && <div {...stylex.props(s.headerTitle)}>{title}</div>}
        {headerActions && (
          <div {...stylex.props(s.headerActions)} data-no-drag="">
            {headerActions}
          </div>
        )}
      </div>
    </div>
  );
}
