import { THEMES } from 'beautiful-mermaid';

interface MermaidThemeItem {
  background?: string;
  displayName: string;
  id: string;
}

const toDisplayName = (id: string) =>
  id
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const mermaidThemes: MermaidThemeItem[] = [
  {
    displayName: 'Lobe Theme',
    id: 'lobe-theme',
  },
  ...Object.entries(THEMES).map(([id, colors]) => ({
    background: colors.bg,
    displayName: toDisplayName(id),
    id,
  })),
];
