import copy from 'copy-to-clipboard';
import { Copy } from 'lucide-react';

import { useCopied } from '@/hooks/useCopied';
import { ActionIcon, ActionIconSize, TooltipProps } from '@/index';
import { DivProps } from '@/types';

export interface CopyButtonProps extends DivProps {
  /**
   * @description Additional class name
   */
  className?: string;
  /**
   * @description The text content to be copied
   */
  content: string;
  /**
   * @description The placement of the tooltip
   * @enum ['top', 'left', 'right', 'bottom', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'leftTop', 'leftBottom', 'rightTop', 'rightBottom']
   * @default 'right'
   */
  placement?: TooltipProps['placement'];
  /**
   * @description The size of the icon
   * @enum ['large', 'normal', 'small', 'site']
   * @default 'site'
   */
  size?: ActionIconSize;
}

const CopyButton = ({
  content,
  className,
  placement = 'right',
  size = 'site',
  ...props
}: CopyButtonProps) => {
  const { copied, setCopied } = useCopied();

  return (
    <ActionIcon
      {...props}
      className={className}
      glass
      icon={Copy}
      onClick={() => {
        copy(content);
        setCopied();
      }}
      placement={placement}
      size={size}
      title={copied ? '✅ Success' : 'Copy'}
    />
  );
};

export default CopyButton;
