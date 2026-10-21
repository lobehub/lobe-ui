import type { DocumentHeading } from '../../types/content';

export type TocItem = DocumentHeading;

export interface TocViewProps {
  activeId: string | undefined;
  items: TocItem[];
  onNavigate: (id: string) => void;
  parentId: string | undefined;
}
