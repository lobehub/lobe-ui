import * as React from 'react';

import { pickProps } from '../../../utils/miscUtil';

const propNames = ['onMouseEnter', 'onMouseLeave'] as const;

export default function useRootProps(props: React.HTMLAttributes<any>) {
  return React.useMemo(() => pickProps(props, propNames), [props]);
}
