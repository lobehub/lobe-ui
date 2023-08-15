import { BackBottom } from '@lobehub/ui';
import { useRef } from 'react';

export default () => {
  const ref = useRef(null);
  return (
    <div style={{ position: 'relative' }}>
      <div ref={ref} style={{ height: 200, overflow: 'auto' }}>
        {Array.from({ length: 40 })
          .fill('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
          .map((item: any, index) => (
            <p key={index}>{item}</p>
          ))}
      </div>
      <BackBottom target={ref} />
    </div>
  );
};
