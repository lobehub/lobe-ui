import { Divider as AntDivider, DividerProps } from 'antd';
import { memo } from 'react';

export type FormDividerProps = DividerProps;
const Divider = memo<FormDividerProps>(({ style, ...rest }) => (
  <AntDivider style={{ margin: 0, opacity: 0.5, ...style }} {...rest} />
));
export default Divider;
