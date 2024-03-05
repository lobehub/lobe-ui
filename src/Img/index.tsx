import { ImageProps } from 'antd';
import { ElementType, createElement, forwardRef, useContext, useMemo } from 'react';

import { ConfigContext } from '@/ConfigProvider';
import { ImgProps } from '@/types';

const createContainer = (as: ElementType) =>
  forwardRef((props: any, ref) => createElement(as, { ...props, ref }));

const Img = forwardRef<any, ImgProps & ImageProps>((props, ref) => {
  const config = useContext(ConfigContext);

  const ImgContainer = useMemo(() => createContainer(config?.imgAs || 'img'), [config]);

  return <ImgContainer ref={ref} {...props} />;
});

export default Img;
