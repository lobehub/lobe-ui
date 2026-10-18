import { MERMAID_PRESETS } from './themes';

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
  ...Object.entries(MERMAID_PRESETS).map(([id, colors]) => ({
    background: colors.bg,
    displayName: toDisplayName(id),
    id,
  })),
];
