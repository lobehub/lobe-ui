import { type FC } from 'react';

export interface BorderSpacingProps {
  borderSpacing?: number;
}

const BorderSpacing: FC<BorderSpacingProps> = ({ borderSpacing }) => {
  if (!borderSpacing) return null;

  return <div style={{ flex: 'none', width: borderSpacing }} />;
};

export default BorderSpacing;
