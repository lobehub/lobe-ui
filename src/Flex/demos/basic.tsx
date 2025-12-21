import { Flexbox } from '@lobehub/ui';

export default () => {
  return (
    <Flexbox gap={8}>
      <div style={{ background: '#333', color: 'white', padding: '20px' }}>Item 1</div>
      <div style={{ background: '#444', color: 'white', padding: '20px' }}>Item 2</div>
      <div style={{ background: '#555', color: 'white', padding: '20px' }}>Item 3</div>
    </Flexbox>
  );
};
