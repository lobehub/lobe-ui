import { cx } from 'antd-style';
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
    <div className={cx(s.header, isDragging && s.headerDragging)} {...handleProps}>
      <div className={s.handle} />
      <div className={s.headerContent}>
        {title && <div className={s.headerTitle}>{title}</div>}
        {headerActions && (
          <div className={s.headerActions} data-no-drag="">
            {headerActions}
          </div>
        )}
      </div>
    </div>
  );
}
