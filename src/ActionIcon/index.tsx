import { DivProps } from '@/types';
import { LucideIcon } from 'lucide-react';
import React from 'react';
import styled from 'styled-components';

const Block = styled.div<{ active?: boolean }>`
  cursor: pointer;

  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;

  color: ${({ active, theme }) => (active ? theme.colorText : theme.colorTextQuaternary)};

  background: ${({ active, theme }) => (active ? theme.colorFill : 'transparent')};

  transition: all 0.2s ${({ theme }) => theme.motionEaseOut};

  &:hover {
    background: ${({ theme }) => theme.colorFillTertiary};
  }

  &:active {
    color: ${({ theme }) => theme.colorText};
    background: ${({ theme }) => theme.colorFill};
  }
`;

export interface ActionIconProps extends DivProps {
  active?: boolean;
  size?:
    | 'large'
    | 'normal'
    | 'small'
    | {
        blockSize: number;
        fontSize: number;
        strokeWidth: number;
        borderRadius: number;
      };
  icon: LucideIcon;
}

const ActionIcon: React.FC<ActionIconProps> = ({
  active,
  icon,
  size = 'normal',
  style,
  ...props
}) => {
  let blockSize: number;
  let fontSize: number;
  let strokeWidth: number;
  let borderRadius: number;
  const Icon: LucideIcon = icon;
  switch (size) {
    case 'large':
      blockSize = 44;
      fontSize = 24;
      strokeWidth = 2;
      borderRadius = 8;
      break;
    case 'normal':
      blockSize = 36;
      fontSize = 24;
      strokeWidth = 2;
      borderRadius = 5;
      break;
    case 'small':
      blockSize = 28;
      fontSize = 20;
      strokeWidth = 1.5;
      borderRadius = 5;
      break;
    default:
      blockSize = size?.blockSize || 36;
      fontSize = size?.fontSize || 24;
      strokeWidth = size?.strokeWidth || 2;
      borderRadius = size?.borderRadius || 5;
      break;
  }
  return (
    <Block
      active={active}
      style={{ width: blockSize, height: blockSize, borderRadius, ...style }}
      {...props}
    >
      <Icon size={fontSize} strokeWidth={strokeWidth} />
    </Block>
  );
};

export default React.memo(ActionIcon);
