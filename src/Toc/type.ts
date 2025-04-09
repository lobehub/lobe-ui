import type { AnchorProps } from 'antd';

export interface TocItemType {
  children?: TocItemType[];
  id: string;
  title: string;
}

export interface TocMobileProps {
  activeKey?: string;
  getContainer?: AnchorProps['getContainer'];
  headerHeight?: number;
  items: TocItemType[];
  onChange?: (activeKey: string) => void;
  tocWidth?: number;
}

export interface TocProps extends TocMobileProps {
  isMobile?: boolean;
}
