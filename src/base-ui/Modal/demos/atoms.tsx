import { Button, Flexbox, Text } from '@lobehub/ui';
import {
  ModalBackdrop,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalPopup,
  ModalPortal,
  ModalRoot,
  ModalTitle,
} from '@lobehub/ui/base-ui';
import { Switch } from 'antd';
import { cssVar } from 'antd-style';
import { useState } from 'react';

const notificationItems = [
  { key: 'mention', label: 'New mentions & replies', desc: 'When someone @mentions you' },
  { key: 'task', label: 'Task assignments', desc: 'When a task is assigned to you' },
  { key: 'digest', label: 'Weekly digest', desc: 'Summary of activity every Monday' },
];

export default () => {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState({ mention: true, task: true, digest: false });

  const toggle = (key: string) =>
    setPrefs((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));

  const activeCount = Object.values(prefs).filter(Boolean).length;

  return (
    <Flexbox gap={16} padding={16} style={{ margin: '0 auto', maxWidth: 560 }}>
      {/* 触发器：设置项行，无卡片容器 */}
      <Flexbox horizontal align="center">
        <Flexbox flex={1} gap={1}>
          <Text style={{ fontSize: 14, fontWeight: 500 }}>Notification Preferences</Text>
          <Text style={{ fontSize: 12, opacity: 0.5 }}>
            {activeCount} of {notificationItems.length} channels enabled
          </Text>
        </Flexbox>
        <Button size="small" onClick={() => setOpen(true)}>
          Configure
        </Button>
      </Flexbox>

      <ModalRoot
        open={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setOpen(false);
        }}
      >
        <ModalPortal>
          <ModalBackdrop />
          <ModalPopup width={480}>
            <ModalHeader>
              <ModalTitle>Notification Preferences</ModalTitle>
              <ModalClose />
            </ModalHeader>

            <ModalContent>
              <Flexbox gap={0}>
                {notificationItems.map(({ key, label, desc }, i) => (
                  <Flexbox
                    horizontal
                    align="center"
                    gap={12}
                    key={key}
                    style={{
                      borderBottom:
                        i < notificationItems.length - 1
                          ? `1px solid ${cssVar.colorBorderSecondary}`
                          : 'none',
                      padding: '12px 0',
                    }}
                  >
                    <Flexbox flex={1} gap={2}>
                      <Text style={{ fontSize: 14, fontWeight: 500 }}>{label}</Text>
                      <Text style={{ fontSize: 12, opacity: 0.5 }}>{desc}</Text>
                    </Flexbox>
                    <Switch
                      checked={prefs[key as keyof typeof prefs]}
                      size="small"
                      onChange={() => toggle(key)}
                    />
                  </Flexbox>
                ))}
              </Flexbox>
            </ModalContent>

            <ModalFooter>
              <ModalClose>
                <Button>Cancel</Button>
              </ModalClose>
              <Button type="primary" onClick={() => setOpen(false)}>
                Save Preferences
              </Button>
            </ModalFooter>
          </ModalPopup>
        </ModalPortal>
      </ModalRoot>
    </Flexbox>
  );
};
