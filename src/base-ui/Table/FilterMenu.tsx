'use client';

import { cx } from 'antd-style';
import { ListFilter } from 'lucide-react';
import { memo, type ReactNode } from 'react';

import DropdownMenu from '@/base-ui/DropdownMenu';
import type { DropdownItem } from '@/base-ui/DropdownMenu/type';
import Icon from '@/Icon';

import { styles } from './style';
import type { FilterValue } from './type';

interface FilterMenuProps {
  filters: { text: ReactNode; value: FilterValue }[];
  label: string;
  onChange: (next: FilterValue[]) => void;
  value: FilterValue[];
}

const FilterMenu = memo<FilterMenuProps>(({ filters, label, onChange, value }) => {
  const items: DropdownItem[] = [
    ...filters.map((filter) => ({
      checked: value.includes(filter.value),
      closeOnClick: false,
      key: String(filter.value),
      label: filter.text,
      onCheckedChange: (checked: boolean) =>
        onChange(
          checked ? [...value, filter.value] : value.filter((item) => item !== filter.value),
        ),
      type: 'checkbox' as const,
    })),
    { type: 'divider' as const },
    { disabled: value.length === 0, key: '__reset', label: 'Reset', onClick: () => onChange([]) },
  ];

  return (
    <DropdownMenu items={items}>
      <button
        aria-label={`Filter ${label}`}
        className={cx(styles.filterButton, value.length > 0 && styles.filterActive)}
        type="button"
      >
        <Icon icon={ListFilter} size={12} />
      </button>
    </DropdownMenu>
  );
});

FilterMenu.displayName = 'TableFilterMenu';

export default FilterMenu;
