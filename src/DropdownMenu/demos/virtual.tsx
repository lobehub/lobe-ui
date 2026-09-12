import { Button, Icon, Input } from '@lobehub/ui';
import {
  DropdownMenuFooter,
  DropdownMenuHeader,
  DropdownMenuItem,
  DropdownMenuItemContent,
  DropdownMenuItemDesc,
  DropdownMenuItemIcon,
  DropdownMenuItemLabel,
  DropdownMenuItemLabelGroup,
  DropdownMenuPopup,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRoot,
  DropdownMenuScrollViewport,
  DropdownMenuTrigger,
} from '@lobehub/ui/base-ui';
import { createStaticStyles } from 'antd-style';
import { CheckIcon, GitBranchIcon, GitBranchPlusIcon, SearchIcon } from 'lucide-react';
import { type KeyboardEvent, useMemo, useState } from 'react';

const styles = createStaticStyles(({ css, cssVar }) => ({
  check: css`
    flex: none;
    color: ${cssVar.colorPrimary};
  `,
  header: css`
    padding-block: 4px;

    .ant-input-affix-wrapper {
      padding-inline: 0;
    }
  `,
  popup: css`
    width: 300px;
    height: 360px;
  `,
}));

const branches = Array.from({ length: 1000 }, (_, index) => ({
  meta: index % 7 === 0 ? `${(index % 5) + 1} uncommitted changes` : undefined,
  name: index === 0 ? 'main' : `feature/branch-${index}`,
}));

const CURRENT = 'feature/branch-42';

const stopMenuKeys = (event: KeyboardEvent) => {
  if (event.key.startsWith('Arrow') || event.key === 'Escape') return;
  event.stopPropagation();
};

export default () => {
  const [search, setSearch] = useState('');
  const [current, setCurrent] = useState(CURRENT);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return branches;
    return branches.filter((branch) => branch.name.toLowerCase().includes(query));
  }, [search]);

  return (
    <DropdownMenuRoot onOpenChange={(open) => !open && setSearch('')}>
      <DropdownMenuTrigger>
        <Button icon={GitBranchIcon}>{current}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuPositioner placement="bottomLeft">
          <DropdownMenuPopup className={styles.popup}>
            <DropdownMenuHeader className={styles.header}>
              <Input
                autoFocus
                placeholder="Find a branch"
                prefix={<Icon icon={SearchIcon} size={14} />}
                size="small"
                value={search}
                variant="borderless"
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={stopMenuKeys}
              />
            </DropdownMenuHeader>
            <DropdownMenuScrollViewport virtual listItemHeight={32}>
              {filtered.map((branch) => (
                <DropdownMenuItem
                  key={branch.name}
                  label={branch.name}
                  onClick={() => setCurrent(branch.name)}
                >
                  <DropdownMenuItemContent>
                    <DropdownMenuItemIcon>
                      <Icon icon={GitBranchIcon} />
                    </DropdownMenuItemIcon>
                    {branch.meta ? (
                      <DropdownMenuItemLabelGroup>
                        <DropdownMenuItemLabel>{branch.name}</DropdownMenuItemLabel>
                        <DropdownMenuItemDesc>{branch.meta}</DropdownMenuItemDesc>
                      </DropdownMenuItemLabelGroup>
                    ) : (
                      <DropdownMenuItemLabel>{branch.name}</DropdownMenuItemLabel>
                    )}
                    {branch.name === current ? (
                      <Icon className={styles.check} icon={CheckIcon} size={14} />
                    ) : null}
                  </DropdownMenuItemContent>
                </DropdownMenuItem>
              ))}
            </DropdownMenuScrollViewport>
            <DropdownMenuFooter>
              <DropdownMenuItem onClick={() => setCurrent(`feature/branch-${branches.length}`)}>
                <DropdownMenuItemContent>
                  <DropdownMenuItemIcon>
                    <Icon icon={GitBranchPlusIcon} />
                  </DropdownMenuItemIcon>
                  <DropdownMenuItemLabel>Checkout new branch…</DropdownMenuItemLabel>
                </DropdownMenuItemContent>
              </DropdownMenuItem>
            </DropdownMenuFooter>
          </DropdownMenuPopup>
        </DropdownMenuPositioner>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
  );
};
