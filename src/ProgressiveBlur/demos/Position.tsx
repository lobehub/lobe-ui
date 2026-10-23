import { Flexbox, ProgressiveBlur } from '@lobehub/ui';

import { frameStyle, Report, scrollStyle, Strip } from './data';

export default () => (
  <Flexbox gap={16} width={'100%'}>
    <div style={{ ...frameStyle, height: 240 }}>
      <div style={scrollStyle}>
        <Report />
      </div>
      <ProgressiveBlur position="top" />
      <ProgressiveBlur position="bottom" />
    </div>
    <div style={{ ...frameStyle, height: 'auto' }}>
      <div style={scrollStyle}>
        <Strip />
      </div>
      <ProgressiveBlur height={48} position="left" />
      <ProgressiveBlur height={48} position="right" />
    </div>
  </Flexbox>
);
