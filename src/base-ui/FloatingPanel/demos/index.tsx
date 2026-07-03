import { Flexbox, Text } from '@lobehub/ui';
import { Button, FloatingPanel } from '@lobehub/ui/base-ui';
import { cssVar } from 'antd-style';
import { MessageCirclePlus, Share2 } from 'lucide-react';
import { useState } from 'react';

const Demo = () => {
  const [open, setOpen] = useState(true);

  return (
    <div
      style={{
        background: cssVar.colorBgLayout,
        border: `1px solid ${cssVar.colorBorderSecondary}`,
        borderRadius: 16,
        minHeight: 460,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Flexbox gap={16} padding={24}>
        <Flexbox horizontal align="center" justify="space-between">
          <Flexbox gap={4}>
            <Text style={{ fontSize: 18, fontWeight: 700 }}>Task Detail Workspace</Text>
            <Text type="secondary">
              Open a contextual run panel without leaving the active task.
            </Text>
          </Flexbox>
          <Button
            icon={<MessageCirclePlus size={16} />}
            type="primary"
            onClick={() => setOpen(true)}
          >
            Open Panel
          </Button>
        </Flexbox>
        <Flexbox
          gap={8}
          style={{
            background: cssVar.colorBgContainer,
            border: `1px solid ${cssVar.colorBorderSecondary}`,
            borderRadius: 12,
            padding: 16,
          }}
        >
          <Text strong>Daily inbox check</Text>
          <Text type="secondary">
            The primary canvas remains readable while the floating panel hosts the follow-up thread.
          </Text>
        </Flexbox>
      </Flexbox>
      <FloatingPanel
        actions={<Button icon={<Share2 size={14} />} size="small" type="text" />}
        footer={<Button block>Send follow up message</Button>}
        getContainer={false}
        maxHeight={420}
        maxWidth={720}
        minHeight={260}
        minWidth={420}
        open={open}
        title="Complete daily inbox review"
        width={560}
        styles={{
          body: { padding: 16 },
        }}
        onOpenChange={setOpen}
      >
        <Flexbox gap={12}>
          <Text strong>Urgent pending</Text>
          <Text>
            One invitation needs a reply before the scheduled event. Review the thread and confirm
            the next action.
          </Text>
          <Text strong>News and references</Text>
          <Text type="secondary">
            The panel is anchored to the viewport corner, has no mask by default, and exposes
            placement-aware resize handles along the free edges.
          </Text>
        </Flexbox>
      </FloatingPanel>
    </div>
  );
};

export default Demo;
