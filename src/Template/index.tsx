import { DivProps } from '@/types';
import React from 'react';

export interface TemplateProps extends DivProps {
  children?: React.ReactNode;
}

const Template: React.FC<TemplateProps> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export default React.memo(Template);
