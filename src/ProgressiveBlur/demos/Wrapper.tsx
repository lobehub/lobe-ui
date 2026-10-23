import { cssVar, ProgressiveBlur } from '@lobehub/ui';

import { Report } from './data';

export default () => (
  <ProgressiveBlur
    height={80}
    style={{
      background: cssVar.colorBgLayout,
      border: `1px solid ${cssVar.colorBorderSecondary}`,
      borderRadius: 12,
      height: 320,
      width: '100%',
    }}
  >
    <Report />
  </ProgressiveBlur>
);
