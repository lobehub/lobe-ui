import { type ReactNode } from 'react';

import { styleProps } from '@/styles/stylex/props';

import { floatingSheetClasses } from './stable';
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
    <div
      {...styleProps([s.header, isDragging && s.headerDragging], floatingSheetClasses('header'))}
      {...handleProps}
    >
      <div {...styleProps(s.handle, floatingSheetClasses('handle'))} />
      <div {...styleProps(s.headerContent, floatingSheetClasses('header-content'))}>
        {title && <div {...styleProps(s.headerTitle, floatingSheetClasses('title'))}>{title}</div>}
        {headerActions && (
          <div
            {...styleProps(s.headerActions, floatingSheetClasses('header-actions'))}
            data-no-drag=""
          >
            {headerActions}
          </div>
        )}
      </div>
    </div>
  );
}
