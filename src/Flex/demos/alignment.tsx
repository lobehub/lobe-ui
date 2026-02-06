import { Flexbox } from '@lobehub/ui';

export default () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4>Justify: flex-start (default)</h4>
        <Flexbox
          horizontal
          gap={8}
          justify="flex-start"
          style={{ background: '#f0f0f0', padding: '8px' }}
          width="100%"
        >
          <div style={{ background: '#333', color: 'white', padding: '20px', width: '100px' }}>
            Item 1
          </div>
          <div style={{ background: '#444', color: 'white', padding: '20px', width: '100px' }}>
            Item 2
          </div>
        </Flexbox>
      </div>

      <div>
        <h4>Justify: center</h4>
        <Flexbox
          horizontal
          gap={8}
          justify="center"
          style={{ background: '#f0f0f0', padding: '8px' }}
          width="100%"
        >
          <div style={{ background: '#333', color: 'white', padding: '20px', width: '100px' }}>
            Item 1
          </div>
          <div style={{ background: '#444', color: 'white', padding: '20px', width: '100px' }}>
            Item 2
          </div>
        </Flexbox>
      </div>

      <div>
        <h4>Justify: space-between</h4>
        <Flexbox
          horizontal
          gap={8}
          justify="space-between"
          style={{ background: '#f0f0f0', padding: '8px' }}
          width="100%"
        >
          <div style={{ background: '#333', color: 'white', padding: '20px', width: '100px' }}>
            Item 1
          </div>
          <div style={{ background: '#444', color: 'white', padding: '20px', width: '100px' }}>
            Item 2
          </div>
          <div style={{ background: '#555', color: 'white', padding: '20px', width: '100px' }}>
            Item 3
          </div>
        </Flexbox>
      </div>

      <div>
        <h4>Align: center</h4>
        <Flexbox
          horizontal
          align="center"
          gap={8}
          style={{ background: '#f0f0f0', height: '120px', padding: '8px' }}
        >
          <div style={{ background: '#333', color: 'white', padding: '20px' }}>Short</div>
          <div style={{ background: '#444', color: 'white', padding: '40px 20px' }}>Tall</div>
          <div style={{ background: '#555', color: 'white', padding: '20px' }}>Short</div>
        </Flexbox>
      </div>
    </div>
  );
};
