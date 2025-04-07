'use client';

import { type ReactNode, RefAttributes } from 'react';

import DraggablePanelParent, { type DraggablePanelProps } from './DraggablePanel';
import DraggablePanelBody from './components/DraggablePanelBody';
import DraggablePanelContainer from './components/DraggablePanelContainer';
import DraggablePanelFooter from './components/DraggablePanelFooter';
import DraggablePanelHeader from './components/DraggablePanelHeader';

export interface IDraggablePanel {
  (props: DraggablePanelProps & RefAttributes<HTMLDivElement>): ReactNode;
  Body: typeof DraggablePanelBody;
  Container: typeof DraggablePanelContainer;
  Footer: typeof DraggablePanelFooter;
  Header: typeof DraggablePanelHeader;
}

const DraggablePanel = DraggablePanelParent as unknown as IDraggablePanel;

DraggablePanel.Body = DraggablePanelBody;
DraggablePanel.Container = DraggablePanelContainer;
DraggablePanel.Footer = DraggablePanelFooter;
DraggablePanel.Header = DraggablePanelHeader;

export default DraggablePanel;
export {
  default as DraggablePanelBody,
  type DraggablePanelBodyProps,
} from './components/DraggablePanelBody';
export {
  default as DraggablePanelContainer,
  type DraggablePanelContainerProps,
} from './components/DraggablePanelContainer';
export {
  default as DraggablePanelFooter,
  type DraggablePanelFooterProps,
} from './components/DraggablePanelFooter';
export {
  default as DraggablePanelHeader,
  type DraggablePanelHeaderProps,
} from './components/DraggablePanelHeader';
export type { DraggablePanelProps } from './DraggablePanel';
