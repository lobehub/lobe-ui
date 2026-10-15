import type { LucideIcon, LucideProps } from 'lucide-react';
import { FileText } from 'lucide-react';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';

const cache = new Map<string, LucideIcon>();

// One component per name: a fresh function each render would remount the icon and refetch it.
export const namedIcon = (name: string): LucideIcon => {
  const cached = cache.get(name);
  if (cached) return cached;
  const NamedIcon = ((props: LucideProps) => (
    <DynamicIcon {...props} fallback={() => <FileText {...props} />} name={name as IconName} />
  )) as LucideIcon;
  NamedIcon.displayName = `NamedIcon(${name})`;
  cache.set(name, NamedIcon);
  return NamedIcon;
};
