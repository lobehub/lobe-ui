import { Flexbox } from '@lobehub/ui';

export default () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4>Gap: 8px</h4>
        <Flexbox gap={8}>
          <div style={{ background: '#333', color: 'white', padding: '20px' }}>Item 1</div>
          <div style={{ background: '#444', color: 'white', padding: '20px' }}>Item 2</div>
          <div style={{ background: '#555', color: 'white', padding: '20px' }}>Item 3</div>
        </Flexbox>
      </div>

      <div>
        <h4>Gap: 16px</h4>
        <Flexbox gap={16}>
          <div style={{ background: '#333', color: 'white', padding: '20px' }}>Item 1</div>
          <div style={{ background: '#444', color: 'white', padding: '20px' }}>Item 2</div>
          <div style={{ background: '#555', color: 'white', padding: '20px' }}>Item 3</div>
        </Flexbox>
      </div>

      <div>
        <h4>Gap: 24px</h4>
        <Flexbox gap={24}>
          <div style={{ background: '#333', color: 'white', padding: '20px' }}>Item 1</div>
          <div style={{ background: '#444', color: 'white', padding: '20px' }}>Item 2</div>
          <div style={{ background: '#555', color: 'white', padding: '20px' }}>Item 3</div>
        </Flexbox>
      </div>
    </div>
  );
};
