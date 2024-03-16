import { AnchorProps } from 'antd';
import { ElementType, createElement, forwardRef, useContext, useMemo } from 'react';

import { ConfigContext } from '@/ConfigProvider';
import { AProps } from '@/types';

const createContainer = (as: ElementType) =>
  forwardRef((props: any, ref) => createElement(as, { ...props, ref }));

const A = forwardRef<any, AProps & AnchorProps>((props, ref) => {
  const config = useContext(ConfigContext);

  const AContainer = useMemo(() => createContainer(config?.aAs || 'a'), [config]);

  return <AContainer ref={ref} {...props} />;
});

export default A;
