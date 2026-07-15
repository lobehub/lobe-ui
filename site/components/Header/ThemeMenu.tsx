import type { DropdownItem } from '@lobehub/ui/DropdownMenu';
import DropdownMenu from '@lobehub/ui/DropdownMenu';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { ThemePreference } from '../../app/providers/SiteProviders';
import { useSiteTheme } from '../../app/providers/SiteProviders';
import { styles } from './style';

const themeOptions: { icon: typeof Sun; label: string; value: ThemePreference }[] = [
  { icon: Sun, label: 'Light', value: 'light' },
  { icon: Moon, label: 'Dark', value: 'dark' },
  { icon: Monitor, label: 'System', value: 'system' },
];

export default function ThemeMenu() {
  const { preference, setPreference } = useSiteTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const items: DropdownItem[] = themeOptions.map(({ icon, label, value }) => ({
    checked: mounted && preference === value,
    icon,
    key: value,
    label,
    onCheckedChange: (checked: boolean) => {
      if (checked) setPreference(value);
    },
    type: 'checkbox',
  }));

  const active = mounted
    ? (themeOptions.find((option) => option.value === preference) ?? themeOptions[2])
    : themeOptions[2];
  const ActiveIcon = active.icon;

  return (
    <DropdownMenu items={items} placement="bottomRight">
      <button
        aria-label="Select theme"
        className={styles.iconButton}
        title="Select theme"
        type="button"
      >
        <ActiveIcon aria-hidden size={16} strokeWidth={1.8} />
      </button>
    </DropdownMenu>
  );
}
