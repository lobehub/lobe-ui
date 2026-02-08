import { DraggablePanel, Tag } from '@lobehub/ui';
import { StoryBook, useCreateStore } from '@lobehub/ui/storybook';
import { useTheme } from 'antd-style';
import {
  BarChart3,
  FileText,
  Filter,
  LayoutGrid,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
} from 'lucide-react';
import { type CSSProperties, memo, type ReactNode, useState } from 'react';

import { Flexbox } from '@/Flex';
import Icon from '@/Icon';

const SidebarItem = memo<{ icon: ReactNode; label: string }>(({ icon, label }) => {
  const theme = useTheme();
  return (
    <Flexbox
      horizontal
      align="center"
      gap={8}
      style={{
        borderRadius: 6,
        color: theme.colorText,
        cursor: 'pointer',
        fontSize: 13,
        padding: '8px 10px',
        transition: 'background 0.2s',
      }}
    >
      {icon}
      <span>{label}</span>
    </Flexbox>
  );
});

SidebarItem.displayName = 'SidebarItem';

const PanelContent = memo(() => {
  const theme = useTheme();
  return (
    <Flexbox gap={4} style={{ padding: 12 }} width={'100%'}>
      <div
        style={{
          color: theme.colorTextDescription,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.05em',
          padding: '4px 10px',
          textTransform: 'uppercase',
        }}
      >
        Workspace
      </div>
      <SidebarItem icon={<Icon icon={LayoutGrid} size={15} />} label="Dashboard" />
      <SidebarItem icon={<Icon icon={Filter} size={15} />} label="Filters" />
      <SidebarItem icon={<Icon icon={BarChart3} size={15} />} label="Analytics" />
      <SidebarItem icon={<Icon icon={MessageSquare} size={15} />} label="Messages" />
      <div style={{ borderTop: `1px solid ${theme.colorBorderSecondary}`, margin: '4px 10px' }} />
      <div
        style={{
          color: theme.colorTextDescription,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.05em',
          padding: '4px 10px',
          textTransform: 'uppercase',
        }}
      >
        Tools
      </div>
      <SidebarItem icon={<Icon icon={Sparkles} size={15} />} label="AI Assistant" />
      <SidebarItem icon={<Icon icon={FileText} size={15} />} label="Documents" />
    </Flexbox>
  );
});

PanelContent.displayName = 'PanelContent';

interface ComparisonRowProps {
  expand: boolean;
  stableLayout: boolean;
  title: string;
}

const ComparisonRow = memo<ComparisonRowProps>(({ expand, stableLayout, title }) => {
  const theme = useTheme();

  const cardStyle: CSSProperties = {
    border: `1px solid ${theme.colorBorderSecondary}`,
    borderRadius: 8,
    overflow: 'hidden',
  };

  return (
    <Flexbox gap={0} style={{ ...cardStyle, flex: 1, minWidth: 0 }}>
      <Flexbox
        horizontal
        align="center"
        gap={8}
        style={{
          borderBottom: `1px solid ${theme.colorBorderSecondary}`,
          fontSize: 13,
          fontWeight: 500,
          padding: '8px 12px',
        }}
      >
        <Tag color={stableLayout ? 'green' : undefined} size="small">
          {stableLayout ? 'stableLayout' : 'default'}
        </Tag>
        <span style={{ color: theme.colorTextSecondary }}>{title}</span>
      </Flexbox>
      <Flexbox horizontal style={{ minHeight: 300, position: 'relative' }} width={'100%'}>
        <DraggablePanel
          defaultSize={{ width: 160 }}
          destroyOnClose={false}
          expand={expand}
          expandable={false}
          minWidth={140}
          placement="left"
          stableLayout={stableLayout}
        >
          <PanelContent />
        </DraggablePanel>
        <Flexbox gap={12} style={{ color: theme.colorTextTertiary, flex: 1, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Main Content</div>
          <div style={{ fontSize: 12, lineHeight: 1.6 }}>
            Collapse the sidebar to observe the difference.
          </div>
        </Flexbox>
      </Flexbox>
    </Flexbox>
  );
});

ComparisonRow.displayName = 'ComparisonRow';

export default () => {
  const store = useCreateStore();
  const [expand, setExpand] = useState(true);
  const theme = useTheme();

  return (
    <StoryBook noPadding levaStore={store}>
      <Flexbox gap={16} style={{ padding: 16 }} width={'100%'}>
        <Flexbox horizontal align="center" gap={12}>
          <Flexbox
            horizontal
            align="center"
            gap={6}
            style={{
              border: `1px solid ${theme.colorBorder}`,
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 13,
              padding: '6px 12px',
              transition: 'all 0.2s',
              userSelect: 'none',
            }}
            onClick={() => setExpand((v) => !v)}
          >
            <Icon icon={expand ? PanelLeftClose : PanelLeftOpen} size={14} />
            <span>{expand ? 'Collapse' : 'Expand'}</span>
          </Flexbox>
          <span style={{ color: theme.colorTextDescription, fontSize: 12 }}>
            Toggle both panels to compare collapse behavior
          </span>
        </Flexbox>

        <Flexbox horizontal gap={16} width={'100%'}>
          <ComparisonRow
            expand={expand}
            stableLayout={false}
            title="Content shifts during collapse"
          />
          <ComparisonRow
            stableLayout
            expand={expand}
            title="Content stays stable during collapse"
          />
        </Flexbox>
      </Flexbox>
    </StoryBook>
  );
};
