import { Flexbox, Text } from '@lobehub/ui';
import { Button, Drawer, type DrawerPlacement } from '@lobehub/ui/base-ui';
import { cssVar } from 'antd-style';
import { useState } from 'react';

const PLACEMENTS: DrawerPlacement[] = ['left', 'right', 'top', 'bottom'];

const RELEASES = [
  { date: 'Mar 12', status: 'Shipped', title: 'Streaming tool calls' },
  { date: 'Mar 08', status: 'Shipped', title: 'Workspace-level model routing' },
  { date: 'Mar 01', status: 'Rolled back', title: 'Inline citation previews' },
  { date: 'Feb 24', status: 'Shipped', title: 'Prompt library sharing' },
];

export default () => {
  const [placement, setPlacement] = useState<DrawerPlacement>('right');
  const [open, setOpen] = useState(false);

  return (
    <>
      <Flexbox horizontal gap={8} wrap="wrap">
        {PLACEMENTS.map((item) => (
          <Button
            key={item}
            onClick={() => {
              setPlacement(item);
              setOpen(true);
            }}
          >
            Open from {item}
          </Button>
        ))}
      </Flexbox>

      <Drawer
        open={open}
        placement={placement}
        title="Release history"
        footer={
          <>
            <Button onClick={() => setOpen(false)}>Close</Button>
            <Button type="primary">Export changelog</Button>
          </>
        }
        onClose={() => setOpen(false)}
      >
        <Flexbox gap={16}>
          <Text as="p" style={{ margin: 0, opacity: 0.65 }}>
            Deployments to production over the last three weeks.
          </Text>
          {RELEASES.map((release) => (
            <Flexbox
              gap={4}
              key={release.title}
              style={{
                borderInlineStart: `2px solid ${cssVar.colorBorderSecondary}`,
                paddingInlineStart: 12,
              }}
            >
              <Text weight={600}>{release.title}</Text>
              <Text style={{ fontSize: 12, opacity: 0.55 }}>
                {release.date} · {release.status}
              </Text>
            </Flexbox>
          ))}
        </Flexbox>
      </Drawer>
    </>
  );
};
