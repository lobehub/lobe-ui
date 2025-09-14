import { Drawer, type DrawerProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { useRef } from 'react';

export default () => {
  const store = useCreateStore();
  const ref = useRef(null);
  const control = useControls(
    {
      containerMaxWidth: {
        step: 1,
        value: 1024,
      },
      height: {
        step: 1,
        value: 600,
      },
      noHeader: true,
      open: true,
      placement: {
        options: ['left', 'right', 'top', 'bottom'],
        value: 'bottom',
      },
      sidebarWidth: {
        step: 1,
        value: 280,
      },
      title: 'Drawer',
    },
    { store },
  ) as DrawerProps;

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 8px 0' }}>Navigation</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div
            style={{
              background: '#f0f0f0',
              borderRadius: '6px',
              cursor: 'pointer',
              padding: '8px 12px',
            }}
          >
            Dashboard
          </div>
          <div style={{ cursor: 'pointer', padding: '8px 12px' }}>Settings</div>
          <div style={{ cursor: 'pointer', padding: '8px 12px' }}>Profile</div>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 8px 0' }}>Quick Actions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ cursor: 'pointer', padding: '8px 12px' }}>Create New</div>
          <div style={{ cursor: 'pointer', padding: '8px 12px' }}>Import Data</div>
          <div style={{ cursor: 'pointer', padding: '8px 12px' }}>Export</div>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 8px 0' }}>Recent Items</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ color: '#666', fontSize: '12px', padding: '6px 12px' }}>Project Alpha</div>
          <div style={{ color: '#666', fontSize: '12px', padding: '6px 12px' }}>Document Beta</div>
          <div style={{ color: '#666', fontSize: '12px', padding: '6px 12px' }}>Task Gamma</div>
        </div>
      </div>
    </div>
  );

  const mainContent = Array.from({ length: 100 }).map((_, i) => (
    <div key={i} style={{ borderBottom: '1px solid #f0f0f0', padding: '12px 0' }}>
      <h4 style={{ margin: '0 0 8px 0' }}>Content Section {i + 1}</h4>
      <p style={{ color: '#666', margin: 0 }}>
        This is a long piece of content to demonstrate that the sidebar stays sticky while the main
        content scrolls. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
    </div>
  ));

  return (
    <StoryBook height={800} levaStore={store} noPadding ref={ref}>
      <Drawer getContainer={false} sidebar={sidebarContent} {...control}>
        {mainContent}
      </Drawer>
    </StoryBook>
  );
};
