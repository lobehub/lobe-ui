import {
  ActionIcon,
  Avatar,
  DraggableSideNav,
  type DraggableSideNavProps,
  Menu,
} from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { HelpCircle, Plus, Search, Settings2, User } from 'lucide-react';
import { useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { items, itemsWithCustomRender } from './data';

export default () => {
  const [activeKey, setActiveKey] = useState<string>('home');
  const store = useCreateStore();

  const control = useControls(
    {
      defaultCollapsed: false,
      maxWidth: {
        step: 1,
        value: 400,
      },
      minWidth: {
        max: 200,
        min: 48,
        step: 1,
        value: 64,
      },
      placement: {
        options: ['left', 'right'],
        value: 'left',
      },
      resizable: true,
      showHandle: true,
      showHandleWhenCollapsed: false,
      withAvatar: true,
      withCustomRender: false,
    },
    { store },
  );

  const { withAvatar, withCustomRender, ...draggableProps } = control;

  return (
    <StoryBook levaStore={store} noPadding>
      <Flexbox height={'100%'} horizontal width={'100%'}>
        {control.placement === 'left' ? (
          <>
            <DraggableSideNav
              {...(draggableProps as DraggableSideNavProps)}
              footer={(collapsed) =>
                collapsed ? (
                  <Flexbox align="center" gap={8}>
                    <ActionIcon icon={HelpCircle} title="Help" />
                    <ActionIcon icon={User} title="Profile" />
                  </Flexbox>
                ) : (
                  <Flexbox align="center" gap={8} horizontal>
                    <ActionIcon icon={HelpCircle} title="Help" />
                    <ActionIcon icon={User} title="Profile" />
                  </Flexbox>
                )
              }
              header={
                withAvatar
                  ? (collapsed) =>
                      collapsed ? (
                        <Flexbox align="center" gap={8}>
                          <Avatar size={40}>U</Avatar>
                          <ActionIcon icon={Plus} title="New" />
                          <ActionIcon icon={Search} title="Search" />
                        </Flexbox>
                      ) : (
                        <Flexbox gap={12}>
                          <Avatar size={48}>U</Avatar>
                          <Flexbox gap={8} horizontal>
                            <ActionIcon icon={Plus} title="New" />
                            <ActionIcon icon={Search} title="Search" />
                          </Flexbox>
                        </Flexbox>
                      )
                  : undefined
              }
            >
              {(collapsed) => (
                <Menu
                  inlineCollapsed={collapsed}
                  items={(withCustomRender ? itemsWithCustomRender : items)(collapsed)}
                  mode="inline"
                  onSelect={(info) => setActiveKey(info.key as string)}
                  selectedKeys={[activeKey]}
                />
              )}
            </DraggableSideNav>
            <Flexbox flex={1} gap={16} padding={24}>
              <div>
                <h2 style={{ marginBottom: '8px' }}>DraggableSideNav Demo</h2>
                <p style={{ fontSize: '14px', margin: 0 }}>
                  A generic resizable side panel container
                </p>
              </div>

              <Flexbox gap={8}>
                <div>
                  <strong>Active Menu Item:</strong> {activeKey}
                </div>
                <div style={{ fontSize: '13px' }}>
                  💡 <strong>Tips:</strong>
                  <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                    <li>Hover to show the toggle handle</li>
                    <li>Drag the edge to resize (auto-collapse below threshold)</li>
                    <li>Click handle to collapse/expand with animation</li>
                    <li>
                      Menu is just an example - use any content you want (header, children, footer
                      all support function props)
                    </li>
                  </ul>
                </div>
              </Flexbox>

              <div style={{ fontSize: '12px' }}>
                Try the controls on the right to customize behavior →
              </div>
            </Flexbox>
          </>
        ) : (
          <>
            <Flexbox flex={1} gap={16} padding={24}>
              <div>
                <h2 style={{ marginBottom: '8px' }}>DraggableSideNav Demo</h2>
                <p style={{ fontSize: '14px', margin: 0 }}>
                  A generic resizable side panel container
                </p>
              </div>

              <Flexbox gap={8}>
                <div>
                  <strong>Active Menu Item:</strong> {activeKey}
                </div>
                <div style={{ fontSize: '13px' }}>
                  💡 <strong>Tips:</strong>
                  <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                    <li>Hover to show the toggle handle</li>
                    <li>Drag the edge to resize (auto-collapse below threshold)</li>
                    <li>Click handle to collapse/expand with animation</li>
                    <li>Right panel uses function props for dynamic content</li>
                  </ul>
                </div>
              </Flexbox>

              <div style={{ fontSize: '12px' }}>
                ← Try the controls on the left to customize behavior
              </div>
            </Flexbox>
            <DraggableSideNav
              {...(draggableProps as DraggableSideNavProps)}
              footer={(collapsed) =>
                collapsed ? (
                  <ActionIcon icon={Settings2} title="Settings" />
                ) : (
                  <Flexbox gap={8} horizontal padding={4}>
                    <ActionIcon icon={Settings2} title="Settings" />
                    <ActionIcon icon={HelpCircle} title="Help" />
                  </Flexbox>
                )
              }
              header={
                withAvatar
                  ? (collapsed) =>
                      collapsed ? (
                        <Avatar size={40}>U</Avatar>
                      ) : (
                        <Flexbox align="center" gap={8}>
                          <Avatar size={48}>U</Avatar>
                          <div style={{ fontSize: '14px', fontWeight: 500 }}>User Name</div>
                        </Flexbox>
                      )
                  : undefined
              }
            >
              {(collapsed) => (
                <Menu
                  inlineCollapsed={collapsed}
                  items={(withCustomRender ? itemsWithCustomRender : items)(collapsed)}
                  mode="inline"
                  onSelect={(info) => setActiveKey(info.key as string)}
                  selectedKeys={[activeKey]}
                />
              )}
            </DraggableSideNav>
          </>
        )}
      </Flexbox>
    </StoryBook>
  );
};
