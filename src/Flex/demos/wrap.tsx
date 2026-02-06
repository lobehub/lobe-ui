import { Flexbox } from '@lobehub/ui';

export default () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4>No Wrap (default)</h4>
        <Flexbox
          horizontal
          gap={8}
          style={{ background: '#f0f0f0', padding: '8px', width: '400px' }}
        >
          <div style={{ background: '#333', color: 'white', minWidth: '120px', padding: '20px' }}>
            Item 1
          </div>
          <div style={{ background: '#444', color: 'white', minWidth: '120px', padding: '20px' }}>
            Item 2
          </div>
          <div style={{ background: '#555', color: 'white', minWidth: '120px', padding: '20px' }}>
            Item 3
          </div>
          <div style={{ background: '#666', color: 'white', minWidth: '120px', padding: '20px' }}>
            Item 4
          </div>
        </Flexbox>
      </div>

      <div>
        <h4>Wrap</h4>
        <Flexbox
          horizontal
          gap={8}
          style={{ background: '#f0f0f0', padding: '8px', width: '400px' }}
          wrap="wrap"
        >
          <div style={{ background: '#666', color: 'white', minWidth: '120px', padding: '20px' }}>
            Item 1
          </div>
          <div style={{ background: '#777', color: 'white', minWidth: '120px', padding: '20px' }}>
            Item 2
          </div>
          <div style={{ background: '#777', color: 'white', minWidth: '120px', padding: '20px' }}>
            Item 3
          </div>
          <div style={{ background: '#888', color: 'white', minWidth: '120px', padding: '20px' }}>
            Item 4
          </div>
        </Flexbox>
      </div>
    </div>
  );
};
