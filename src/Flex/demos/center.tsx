import { Center } from '@lobehub/ui';

export default () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4>Center Component</h4>
        <Center style={{ background: '#f0f0f0', border: '2px dashed #d9d9d9', height: '200px' }}>
          <div style={{ background: '#333', color: 'white', padding: '20px' }}>
            Centered Content
          </div>
        </Center>
      </div>

      <div>
        <h4>Center with Gap</h4>
        <Center
          gap={16}
          style={{ background: '#f0f0f0', border: '2px dashed #d9d9d9', height: '200px' }}
        >
          <div style={{ background: '#333', color: 'white', padding: '20px' }}>Item 1</div>
          <div style={{ background: '#444', color: 'white', padding: '20px' }}>Item 2</div>
        </Center>
      </div>
    </div>
  );
};
