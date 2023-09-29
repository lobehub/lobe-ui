import { Divider as AntDivider, DividerProps } from 'antd';
import { memo } from 'react';

export type FormDividerProps = DividerProps;
const Divider = memo<FormDividerProps>(({ style, ...props }) => (
  <AntDivider style={{ margin: 0, opacity: 0.5, ...style }} {...props} />
));
export default Divider;
