import { Flexbox } from '@lobehub/ui';

export default () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4>Horizontal </h4>
        <Flexbox horizontal gap={8}>
          <div style={{ background: '#333', color: 'white', padding: '20px' }}>Item 1</div>
          <div style={{ background: '#444', color: 'white', padding: '20px' }}>Item 2</div>
          <div style={{ background: '#555', color: 'white', padding: '20px' }}>Item 3</div>
        </Flexbox>
      </div>

      <div>
        <h4>Vertical (default)</h4>
        <Flexbox gap={8}>
          <div style={{ background: '#333', color: 'white', padding: '20px' }}>Item 1</div>
          <div style={{ background: '#444', color: 'white', padding: '20px' }}>Item 2</div>
          <div style={{ background: '#555', color: 'white', padding: '20px' }}>Item 3</div>
        </Flexbox>
      </div>

      <div>
        <h4>Horizontal Reverse</h4>
        <Flexbox direction="horizontal-reverse" gap={8}>
          <div style={{ background: '#666', color: 'white', padding: '20px' }}>Item 1</div>
          <div style={{ background: '#777', color: 'white', padding: '20px' }}>Item 2</div>
          <div style={{ background: '#888', color: 'white', padding: '20px' }}>Item 3</div>
        </Flexbox>
      </div>
    </div>
  );
};
