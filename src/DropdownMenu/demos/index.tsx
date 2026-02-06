import { DropdownMenu } from '@lobehub/ui';
import { createStaticStyles } from 'antd-style';
import { MoreHorizontal } from 'lucide-react';

import { items } from './data';

const styles = createStaticStyles(({ css, cssVar }) => ({
  trigger: css`
    cursor: pointer;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    width: 44px;
    height: 44px;
    padding: 0;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: 12px;

    color: ${cssVar.colorTextSecondary};

    background: ${cssVar.colorBgElevated};

    transition: all 150ms ${cssVar.motionEaseOut};

    &:hover {
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillSecondary};
    }

    &:active {
      transform: translateY(1px);
    }

    &[data-state='open'],
    &[aria-expanded='true'] {
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillTertiary};
    }
  `,
}));

export default () => {
  return (
    <DropdownMenu nativeButton items={items}>
      <button aria-label="Open menu" className={styles.trigger} type="button">
        <MoreHorizontal />
      </button>
    </DropdownMenu>
  );
};
