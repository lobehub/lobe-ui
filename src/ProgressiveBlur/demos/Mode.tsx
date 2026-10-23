import { Flexbox, ProgressiveBlur, type ProgressiveBlurMode } from '@lobehub/ui';

import { frameStyle, Report, scrollStyle } from './data';

const modes: ProgressiveBlurMode[] = ['auto', 'blur', 'gradient'];

export default () => (
  <Flexbox horizontal gap={16} width={'100%'}>
    {modes.map((mode) => (
      <Flexbox flex={1} gap={8} key={mode} style={{ minWidth: 0 }}>
        <code>mode=&quot;{mode}&quot;</code>
        <div style={{ ...frameStyle, height: 240 }}>
          <div style={scrollStyle}>
            <Report />
          </div>
          <ProgressiveBlur height={96} mode={mode} />
        </div>
      </Flexbox>
    ))}
  </Flexbox>
);
