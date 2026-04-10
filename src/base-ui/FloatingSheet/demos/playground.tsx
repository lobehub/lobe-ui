import { Button, Flexbox, Text } from '@lobehub/ui';
import { FloatingSheet, type FloatingSheetProps } from '@lobehub/ui/base-ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { Tag } from 'antd';
import { cssVar } from 'antd-style';
import { SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState } from 'react';

const snapPresets = {
  balanced: [0.28, 0.52, 0.82],
  compact: [0.24, 0.4, 0.64],
  none: [],
  tall: [0.36, 0.68, 0.92],
} as const;

type SnapPreset = keyof typeof snapPresets;

interface PlaygroundControls {
  activeSnapPoint: number;
  className: string;
  closeThreshold: number;
  controlled: boolean;
  defaultOpen: boolean;
  dismissible: boolean;
  maxHeight: number;
  minHeight: number;
  mode: 'overlay' | 'push';
  open: boolean;
  showHeaderActions: boolean;
  snapPreset: SnapPreset;
  title: string;
  useActiveSnapPoint: boolean;
  variant: 'elevated' | 'embedded';
  width: string;
}

const shellStyle = {
  background: cssVar.colorBgContainer,
  border: `1px solid ${cssVar.colorBorderSecondary}`,
  borderRadius: 20,
  boxShadow: cssVar.boxShadowSecondary,
  overflow: 'hidden',
};

const stageStyle = {
  background: `
    radial-gradient(circle at top left, color-mix(in srgb, ${cssVar.colorPrimary} 16%, transparent), transparent 36%),
    linear-gradient(180deg, ${cssVar.colorBgElevated} 0%, ${cssVar.colorBgLayout} 100%)
  `,
  border: `1px solid ${cssVar.colorBorderSecondary}`,
  borderRadius: 18,
  display: 'flex',
  flexDirection: 'column' as const,
  height: 500,
  overflow: 'hidden',
  position: 'relative' as const,
};

const statCardStyle = {
  background: `color-mix(in srgb, ${cssVar.colorBgContainer} 90%, transparent)`,
  border: `1px solid ${cssVar.colorBorderSecondary}`,
  borderRadius: 12,
  padding: '10px 12px',
};

export default () => {
  const store = useCreateStore();
  const [controls, setControls] = useControls(
    () => ({
      activeSnapPoint: {
        max: 0.95,
        min: 0.1,
        step: 0.01,
        value: 0.52,
      },
      className: 'floating-sheet-playground',
      closeThreshold: {
        max: 0.6,
        min: 0.05,
        step: 0.05,
        value: 0.25,
      },
      controlled: true,
      defaultOpen: true,
      dismissible: true,
      maxHeight: {
        max: 0.98,
        min: 0.2,
        step: 0.02,
        value: 0.82,
      },
      minHeight: {
        max: 320,
        min: 80,
        step: 10,
        value: 140,
      },
      mode: {
        options: ['overlay', 'push'],
        value: 'overlay',
      },
      open: true,
      showHeaderActions: true,
      snapPreset: {
        options: Object.keys(snapPresets),
        value: 'balanced',
      },
      title: 'FloatingSheet Playground',
      useActiveSnapPoint: true,
      variant: {
        options: ['elevated', 'embedded'],
        value: 'elevated',
      },
      width: {
        options: ['100%', '92%', 'min(100%, 420px)'],
        value: '100%',
      },
    }),
    { store },
  ) as [
    PlaygroundControls,
    (values: Partial<PlaygroundControls>) => void,
    (path: keyof PlaygroundControls) => PlaygroundControls[keyof PlaygroundControls],
  ];

  const snapPoints = useMemo(
    () => Array.from(snapPresets[controls.snapPreset]),
    [controls.snapPreset],
  );
  const [remountSeed, setRemountSeed] = useState(0);

  const sheetProps: FloatingSheetProps = {
    activeSnapPoint: controls.useActiveSnapPoint ? controls.activeSnapPoint : undefined,
    className: controls.className.trim() || undefined,
    closeThreshold: controls.closeThreshold,
    defaultOpen: controls.defaultOpen,
    dismissible: controls.dismissible,
    headerActions: controls.showHeaderActions ? (
      <Button
        data-no-drag=""
        icon={<X size={14} />}
        size="small"
        type="text"
        onClick={() => {
          if (controls.controlled) {
            setControls({ open: false });
            return;
          }

          setControls({ defaultOpen: false, open: false });
          setRemountSeed((value) => value + 1);
        }}
      />
    ) : undefined,
    maxHeight: controls.maxHeight,
    minHeight: controls.minHeight,
    mode: controls.mode,
    onOpenChange: (open) => setControls({ open }),
    onSnapPointChange: controls.useActiveSnapPoint
      ? (activeSnapPoint) => setControls({ activeSnapPoint })
      : undefined,
    open: controls.controlled ? controls.open : undefined,
    snapPoints,
    title: controls.title.trim() ? (
      <Text style={{ fontSize: 13, fontWeight: 600 }}>{controls.title}</Text>
    ) : undefined,
    variant: controls.variant,
    width: controls.width,
  };

  const componentKey = JSON.stringify({
    controlled: controls.controlled,
    defaultOpen: controls.defaultOpen,
    mode: controls.mode,
    remountSeed,
    snapPreset: controls.snapPreset,
    variant: controls.variant,
  });

  return (
    <StoryBook gap={16} levaStore={store}>
      <Flexbox gap={16} style={{ margin: '0 auto', maxWidth: 760, width: '100%' }}>
        <Flexbox gap={6}>
          <Flexbox horizontal align="center" gap={8}>
            <SlidersHorizontal size={18} style={{ color: cssVar.colorPrimary }} />
            <Text style={{ fontSize: 18, fontWeight: 700 }}>Props Playground</Text>
          </Flexbox>
          <Text style={{ color: cssVar.colorTextSecondary, fontSize: 13 }}>
            This story exposes the full `FloatingSheetProps` surface. The sheet itself is rendered
            from a single explicit `sheetProps` object inside the demo source.
          </Text>
        </Flexbox>

        <Flexbox gap={16} style={shellStyle}>
          <Flexbox horizontal align="center" gap={10} justify="space-between" padding={20}>
            <Flexbox gap={2}>
              <Text style={{ fontSize: 15, fontWeight: 600 }}>Runtime State</Text>
              <Text style={{ color: cssVar.colorTextSecondary, fontSize: 12 }}>
                Controlled mode allows the panel to drive `open`; uncontrolled mode applies
                `defaultOpen` on remount.
              </Text>
            </Flexbox>
            {controls.controlled ? (
              <Button
                size="small"
                type="primary"
                onClick={() => setControls({ open: !controls.open })}
              >
                {controls.open ? 'Close Sheet' : 'Open Sheet'}
              </Button>
            ) : (
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  setControls({ open: controls.defaultOpen });
                  setRemountSeed((value) => value + 1);
                }}
              >
                Remount Sheet
              </Button>
            )}
          </Flexbox>

          <Flexbox horizontal gap={10} padding={'0 20px'}>
            {[
              {
                label: 'open',
                value: controls.controlled
                  ? String(controls.open)
                  : `${String(controls.open)} (uncontrolled)`,
              },
              {
                label: 'snapPoints',
                value: snapPoints.length > 0 ? snapPoints.join(' / ') : 'none',
              },
              {
                label: 'activeSnapPoint',
                value: controls.useActiveSnapPoint
                  ? controls.activeSnapPoint.toFixed(2)
                  : 'undefined',
              },
              {
                label: 'mode',
                value: controls.mode,
              },
              {
                label: 'variant',
                value: controls.variant,
              },
            ].map(({ label, value }) => (
              <div key={label} style={statCardStyle}>
                <Text style={{ color: cssVar.colorTextTertiary, fontSize: 11 }}>{label}</Text>
                <Text style={{ display: 'block', fontSize: 13, fontWeight: 600, marginTop: 2 }}>
                  {value}
                </Text>
              </div>
            ))}
          </Flexbox>

          <div style={{ padding: 20, paddingTop: 16 }}>
            <div style={stageStyle}>
              <Flexbox gap={12} padding={18} style={{ minHeight: 0 }}>
                <Flexbox horizontal align="center" gap={8} wrap="wrap">
                  <Tag bordered={false} color="blue" style={{ margin: 0 }}>
                    className: {sheetProps.className ?? 'undefined'}
                  </Tag>
                  <Tag bordered={false} color="geekblue" style={{ margin: 0 }}>
                    width: {String(sheetProps.width)}
                  </Tag>
                  <Tag bordered={false} color="cyan" style={{ margin: 0 }}>
                    dismissible: {String(sheetProps.dismissible)}
                  </Tag>
                  <Tag bordered={false} color="purple" style={{ margin: 0 }}>
                    variant: {sheetProps.variant}
                  </Tag>
                </Flexbox>

                <Flexbox gap={10} style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
                  {[
                    'Toolbar region',
                    'Scrollable content area',
                    'Detail rows that remain visible behind the sheet',
                    'Stage boundary for overlay and push layout modes',
                  ].map((item) => (
                    <div key={item} style={statCardStyle}>
                      <Text style={{ fontSize: 13 }}>{item}</Text>
                    </div>
                  ))}
                </Flexbox>
              </Flexbox>

              <FloatingSheet key={componentKey} {...sheetProps}>
                <Flexbox gap={10} style={{ padding: '0 16px 16px' }}>
                  {[
                    { label: 'children', value: 'Render any custom content here' },
                    {
                      label: 'headerActions',
                      value: sheetProps.headerActions ? 'Custom action node mounted' : 'undefined',
                    },
                    {
                      label: 'title',
                      value: sheetProps.title ? controls.title : 'undefined',
                    },
                  ].map(({ label, value }) => (
                    <Flexbox
                      horizontal
                      align="center"
                      justify="space-between"
                      key={label}
                      style={{
                        background: cssVar.colorFillQuaternary,
                        borderRadius: 12,
                        padding: '11px 12px',
                      }}
                    >
                      <Text style={{ color: cssVar.colorTextSecondary, fontSize: 12 }}>
                        {label}
                      </Text>
                      <Text style={{ fontSize: 12, fontWeight: 600 }}>{value}</Text>
                    </Flexbox>
                  ))}
                </Flexbox>
              </FloatingSheet>
            </div>
          </div>
        </Flexbox>
      </Flexbox>
    </StoryBook>
  );
};
