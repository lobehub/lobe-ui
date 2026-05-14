import { Menu } from '@base-ui/react/menu';
import {
  ActionIcon,
  DropdownMenuPopup,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  renderDropdownMenuItems,
  Tooltip,
} from '@lobehub/ui';
import { createStaticStyles } from 'antd-style';
import { FileTextIcon, PlusIcon, StoreIcon, WrenchIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';

import type { DropdownMenuProps } from '../type';

const styles = createStaticStyles(({ css, cssVar }) => ({
  caseTitle: css`
    margin-block-end: 10px;

    font-size: 12px;
    font-weight: 600;
    line-height: 18px;
    color: ${cssVar.colorTextSecondary};
  `,
  comparison: css`
    display: grid;
    grid-template-columns: minmax(360px, max-content) minmax(360px, max-content);
    gap: 64px;
    align-items: start;

    padding-block: 160px;
    padding-inline: 120px;
  `,
  countChip: css`
    flex: none;

    padding-block: 1px;
    padding-inline: 6px;
    border-radius: ${cssVar.borderRadiusSM};

    font-size: 11px;
    line-height: 16px;
    color: ${cssVar.colorTextSecondary};

    background: ${cssVar.colorFillSecondary};
  `,
  labelWithChip: css`
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-between;

    min-width: 180px;
  `,
  menuItem: css`
    cursor: default;

    display: flex;
    gap: 8px;
    align-items: center;

    min-height: 32px;
    padding-block: 5px;
    padding-inline: 8px;
    border-radius: ${cssVar.borderRadiusSM};

    font-size: 13px;
    color: ${cssVar.colorText};

    outline: none;

    &[data-highlighted],
    &:hover {
      background: ${cssVar.colorFillSecondary};
    }
  `,
  menuPopup: css`
    min-width: 220px;
    padding: 4px;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: ${cssVar.borderRadius};

    background: ${cssVar.colorBgElevated};
    box-shadow: ${cssVar.boxShadowSecondary};
  `,
  primitiveTrigger: css`
    cursor: default;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 32px;
    height: 32px;
    border-radius: ${cssVar.borderRadius};

    color: ${cssVar.colorText};

    outline: none;

    &:hover,
    &[data-popup-open] {
      background: ${cssVar.colorFillSecondary};
    }
  `,
  separator: css`
    height: 1px;
    margin-block: 4px;
    margin-inline: 6px;
    background: ${cssVar.colorBorderSecondary};
  `,
  status: css`
    display: grid;
    grid-template-columns: auto auto;
    gap: 6px 10px;
    align-items: center;

    min-width: 180px;

    font-size: 12px;
    line-height: 18px;
    color: ${cssVar.colorTextSecondary};
  `,
  statusValue: css`
    color: ${cssVar.colorSuccess};

    &[data-closed='true'] {
      color: ${cssVar.colorError};
    }
  `,
  submenuArrow: css`
    margin-inline-start: auto;
    color: ${cssVar.colorTextSecondary};
  `,
  triggerRow: css`
    display: flex;
    gap: 16px;
    align-items: center;
  `,
}));

interface MenuStatus {
  lastRootReason: string;
  rootOpen: boolean;
  toolsOpen: boolean;
}

const getReason = (details: { reason?: string }) => details.reason ?? 'unknown';

const LabelWithCount = ({
  count,
  label,
  prefix,
}: {
  count: number;
  label: string;
  prefix: string;
}) => (
  <span className={styles.labelWithChip}>
    <span>{label}</span>
    <span className={styles.countChip}>{`${prefix} | ${count}`}</span>
  </span>
);

const StatusPanel = ({ lastRootReason, rootOpen, toolsOpen }: MenuStatus) => (
  <div className={styles.status}>
    <span>root</span>
    <span className={styles.statusValue} data-closed={!rootOpen}>
      {rootOpen ? 'open' : 'closed'}
    </span>
    <span>tools submenu</span>
    <span className={styles.statusValue} data-closed={!toolsOpen}>
      {toolsOpen ? 'open' : 'closed'}
    </span>
    <span>last root reason</span>
    <span>{lastRootReason}</span>
  </div>
);

const LobeUiWrappedCase = () => {
  const [rootOpen, setRootOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [lastRootReason, setLastRootReason] = useState('idle');
  const menuItemsRef = useRef<ReactNode[] | null>(null);

  const items = useMemo<Exclude<DropdownMenuProps['items'], () => unknown>>(
    () => [
      {
        icon: FileTextIcon,
        key: 'upload',
        label: 'Upload file',
      },
      { type: 'divider' },
      {
        children: [
          {
            closeOnClick: false,
            key: 'skill-excalidraw',
            label: 'Excalidraw Diagram',
          },
          {
            closeOnClick: false,
            key: 'skill-flowchart',
            label: 'Flowchart',
          },
          {
            closeOnClick: false,
            key: 'skill-ppt',
            label: 'PPT Creator',
          },
        ],
        closeDelay: 100,
        delay: 0,
        icon: WrenchIcon,
        key: 'tools',
        label: <LabelWithCount count={17} label="Skills" prefix="Auto" />,
        onOpenChange: (open) => setToolsOpen(open),
        openOnHover: true,
        type: 'submenu',
      },
      {
        icon: StoreIcon,
        key: 'store',
        label: 'Skill Store',
      },
    ],
    [],
  );

  const menuItems = useMemo(() => {
    if (!rootOpen) return menuItemsRef.current;

    const renderedItems = renderDropdownMenuItems(items);
    menuItemsRef.current = renderedItems;
    return renderedItems;
  }, [items, rootOpen]);

  const handleRootOpenChange = useCallback((open: boolean, details: { reason?: string }) => {
    setLastRootReason(getReason(details));
    setRootOpen(open);
    if (!open) {
      menuItemsRef.current = null;
      setToolsOpen(false);
    }
  }, []);

  return (
    <div>
      <div className={styles.caseTitle}>lobe-ui DropdownMenu composition</div>
      <div className={styles.triggerRow}>
        <DropdownMenuRoot open={rootOpen} onOpenChange={handleRootOpenChange}>
          <DropdownMenuTrigger nativeButton={false}>
            <ActionIcon
              icon={PlusIcon}
              title="Add files, skills, and more context"
              tooltipProps={{
                arrow: false,
                placement: 'top',
              }}
            />
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuPositioner placement="topLeft">
              <DropdownMenuPopup
                style={{
                  minWidth: 220,
                }}
              >
                {menuItems}
              </DropdownMenuPopup>
            </DropdownMenuPositioner>
          </DropdownMenuPortal>
        </DropdownMenuRoot>

        <StatusPanel lastRootReason={lastRootReason} rootOpen={rootOpen} toolsOpen={toolsOpen} />
      </div>
    </div>
  );
};

const BaseUiPrimitiveCase = () => {
  const [rootOpen, setRootOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [lastRootReason, setLastRootReason] = useState('idle');

  const handleRootOpenChange = useCallback((open: boolean, details: { reason?: string }) => {
    setLastRootReason(getReason(details));
    setRootOpen(open);
    if (!open) setToolsOpen(false);
  }, []);

  return (
    <div>
      <div className={styles.caseTitle}>Base UI Menu primitives with lobe-ui Tooltip</div>
      <div className={styles.triggerRow}>
        <Menu.Root modal={false} open={rootOpen} onOpenChange={handleRootOpenChange}>
          <Tooltip arrow={false} placement="top" title="Add files, skills, and more context">
            <Menu.Trigger
              nativeButton={false}
              render={
                <div
                  aria-label="Add files, skills, and more context"
                  className={styles.primitiveTrigger}
                  tabIndex={0}
                >
                  <PlusIcon size={18} />
                </div>
              }
            />
          </Tooltip>
          <Menu.Portal>
            <Menu.Positioner align="start" side="top" sideOffset={6}>
              <Menu.Popup className={styles.menuPopup}>
                <Menu.Item className={styles.menuItem} label="Upload file">
                  <FileTextIcon size={14} />
                  <span>Upload file</span>
                </Menu.Item>
                <Menu.Separator className={styles.separator} />
                <Menu.SubmenuRoot onOpenChange={(open) => setToolsOpen(open)}>
                  <Menu.SubmenuTrigger
                    openOnHover
                    className={styles.menuItem}
                    closeDelay={100}
                    delay={0}
                    label="Skills"
                  >
                    <WrenchIcon size={14} />
                    <LabelWithCount count={17} label="Skills" prefix="Auto" />
                    <span className={styles.submenuArrow}>›</span>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
                    <Menu.Positioner alignOffset={-4} sideOffset={-1}>
                      <Menu.Popup className={styles.menuPopup}>
                        <Menu.Item
                          className={styles.menuItem}
                          closeOnClick={false}
                          label="Excalidraw Diagram"
                        >
                          <span>Excalidraw Diagram</span>
                        </Menu.Item>
                        <Menu.Item
                          className={styles.menuItem}
                          closeOnClick={false}
                          label="Flowchart"
                        >
                          <span>Flowchart</span>
                        </Menu.Item>
                        <Menu.Item
                          className={styles.menuItem}
                          closeOnClick={false}
                          label="PPT Creator"
                        >
                          <span>PPT Creator</span>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.Item className={styles.menuItem} label="Skill Store">
                  <StoreIcon size={14} />
                  <span>Skill Store</span>
                </Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>

        <StatusPanel lastRootReason={lastRootReason} rootOpen={rootOpen} toolsOpen={toolsOpen} />
      </div>
    </div>
  );
};

export default () => (
  <div className={styles.comparison}>
    <LobeUiWrappedCase />
    <BaseUiPrimitiveCase />
  </div>
);
