import { DraggableSideNav } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { useState } from 'react';

import { Flexbox } from '@/Flex';

import { DemoBody } from './Body';
import { DemoFooter } from './Footer';
import { DemoHeader } from './Header';

export default () => {
  const [width, setWidth] = useState(300);
  const [expand, setExpand] = useState(true);
  const [activeKey, setActiveKey] = useState<string>('home');
  const store = useCreateStore();

  const control = useControls(
    {
      defaultExpand: true,
      defaultWidth: {
        step: 1,
        value: 280,
      },
      maxWidth: {
        step: 1,
        value: 320,
      },
      minWidth: {
        max: 200,
        min: 48,
        step: 1,
        value: 54,
      },
      resizable: true,
      showHandle: true,
      showHandleWhenCollapsed: false,
    },
    { store },
  );

  // Type-safe props
  const sideNavProps = {
    ...control,
    placement: 'left' as const,
  };

  return (
    <StoryBook levaStore={store} noPadding>
      <Flexbox height={'100%'} horizontal width={'100%'}>
        <DraggableSideNav
          body={(expand) => (
            <DemoBody activeKey={activeKey} expand={expand} onSelect={setActiveKey} />
          )}
          expand={expand}
          footer={(expand) => <DemoFooter expand={expand} />}
          header={(expand) => (
            <DemoHeader activeKey={activeKey} expand={expand} onSelect={setActiveKey} />
          )}
          onExpandChange={setExpand}
          onWidthChange={(_, width) => setWidth(width)}
          width={width}
          {...sideNavProps}
        />

        <Flexbox flex={1} gap={16} padding={24}>
          <div>
            <h2 style={{ marginBottom: '8px' }}>DraggableSideNav Demo</h2>
            <p style={{ fontSize: '14px', margin: 0 }}>
              A workspace-style side panel with draggable resize
            </p>
          </div>

          <Flexbox gap={8}>
            <div>
              <strong>Active:</strong> {activeKey}
            </div>
            <div>
              <button
                onClick={() => setExpand(!expand)}
                style={{
                  background: expand ? '#1890ff' : '#52c41a',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '8px 16px',
                }}
                type="button"
              >
                {expand ? '折叠侧边栏' : '展开侧边栏'}
              </button>
            </div>
            <div style={{ fontSize: '13px' }}>
              ✨ <strong>Features:</strong>
              <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                <li>
                  <strong>Smart Handle:</strong> Hover to reveal toggle button
                </li>
                <li>
                  <strong>Flexible Resize:</strong> Drag to adjust panel width
                </li>
                <li>
                  <strong>Auto-collapse:</strong> Drag below threshold for smart collapse
                </li>
                <li>
                  <strong>Performance:</strong> No animation overhead for better performance
                </li>
              </ul>
            </div>
          </Flexbox>

          <div style={{ color: '#999', fontSize: '12px' }}>
            💡 Try dragging the panel edge and using the toggle button →
          </div>
        </Flexbox>
      </Flexbox>
    </StoryBook>
  );
};
