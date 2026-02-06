import { Button, DropdownMenu } from '@lobehub/ui';
import { createStaticStyles } from 'antd-style';
import { MoreHorizontal } from 'lucide-react';

import { items } from './data';

const styles = createStaticStyles(({ css, cssVar }) => ({
  link: css`
    cursor: pointer;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    height: 32px;
    padding-block: 0;
    padding-inline: 12px;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: 10px;

    color: ${cssVar.colorTextSecondary};
    text-decoration: none;

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
  row: css`
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
  `,
}));

export default () => {
  return (
    <div className={styles.row}>
      {/* Custom component trigger (not a literal <button>) */}
      <DropdownMenu nativeButton items={items}>
        <Button>Open (Button)</Button>
      </DropdownMenu>

      {/* Non-button trigger (anchor) */}
      <DropdownMenu items={items} nativeButton={false}>
        <a className={styles.link} href="#" onClick={(e) => e.preventDefault()}>
          <MoreHorizontal style={{ marginRight: 8 }} />
          Open (Anchor)
        </a>
      </DropdownMenu>
    </div>
  );
};
