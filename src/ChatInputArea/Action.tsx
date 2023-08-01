import { createStyles } from 'antd-style';
import { Maximize2, Minimize2 } from 'lucide-react';
import { ReactNode, memo, useCallback } from 'react';

import ActionIcon from '@/ActionIcon';

const useStyles = createStyles(({ css }) => {
  return {
    actionLeft: css`
      display: flex;
      flex: 1;
      gap: 4px;
      align-items: center;
      justify-content: flex-start;
    `,
    actionsBar: css`
      display: flex;
      flex: none;
      align-items: center;
      justify-content: space-between;

      padding: 0 16px;
    `,
    actionsRight: css`
      display: flex;
      flex: 0;
      gap: 4px;
      align-items: center;
      justify-content: flex-end;
    `,
  };
});

export interface ActionProps {
  /**
   * @description Actions to be displayed in the input area
   */
  actions?: ReactNode;
  actionsRight?: ReactNode;
  expand?: boolean;
  onExpandChange?: (expand: boolean) => void;
}

const Action = memo<ActionProps>(({ actions, actionsRight, expand, onExpandChange }) => {
  const { styles } = useStyles();

  const handleExpandClick = useCallback(() => {
    if (onExpandChange) onExpandChange(!expand);
  }, [expand]);

  return (
    <div className={styles.actionsBar}>
      <div className={styles.actionLeft}>{actions}</div>
      <div className={styles.actionsRight}>
        {actionsRight}
        <ActionIcon icon={expand ? Minimize2 : Maximize2} onClick={handleExpandClick} />
      </div>
    </div>
  );
});

export default Action;
