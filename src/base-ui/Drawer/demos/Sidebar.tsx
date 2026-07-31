import { Flexbox, Text } from '@lobehub/ui';
import { Button, Drawer } from '@lobehub/ui/base-ui';
import { cssVar } from 'antd-style';
import { useState } from 'react';

const SECTIONS = {
  'Appearance':
    'Theme, density, and font preferences applied across every workspace you belong to.',
  'Data controls': 'Retention windows, export requests, and training opt-out for this workspace.',
  'General': 'Workspace name, default locale, and the landing surface members see on sign-in.',
  'Members': 'Seat allocation, invite links, and per-role permission overrides.',
  'Models': 'Provider keys, routing rules, and fallbacks used when a primary model is unavailable.',
};

type SectionKey = keyof typeof SECTIONS;

export default () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<SectionKey>('General');

  return (
    <>
      <Button onClick={() => setOpen(true)}>Workspace settings</Button>

      <Drawer
        open={open}
        title="Settings"
        width="min(920px, 90vw)"
        sidebar={
          <Flexbox gap={2}>
            {(Object.keys(SECTIONS) as SectionKey[]).map((key) => (
              <Flexbox
                key={key}
                paddingBlock={8}
                paddingInline={12}
                style={{
                  background: active === key ? cssVar.colorFillSecondary : 'transparent',
                  borderRadius: 8,
                  cursor: 'pointer',
                }}
                onClick={() => setActive(key)}
              >
                <Text weight={active === key ? 600 : 400}>{key}</Text>
              </Flexbox>
            ))}
          </Flexbox>
        }
        onClose={() => setOpen(false)}
      >
        <Flexbox gap={12}>
          <Text as="h3" style={{ margin: 0 }}>
            {active}
          </Text>
          <Text as="p" style={{ margin: 0, opacity: 0.65 }}>
            {SECTIONS[active]}
          </Text>
        </Flexbox>
      </Drawer>
    </>
  );
};
