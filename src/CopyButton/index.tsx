import { useCopied } from '@/hooks/useCopied';
import { ActionIcon, ActionIconSize, TooltipProps } from '@/index';
import { DivProps } from '@/types';
import copy from 'copy-to-clipboard';
import { Copy } from 'lucide-react';

export interface CopyButtonProps extends DivProps {
  /**
   * @description The text content to be copied
   */
  content: string;
  /**
   * @description The size of the icon
   * @enum ['large', 'normal', 'small', 'site']
   * @default 'site'
   */
  size?: ActionIconSize;
  /**
   * @description Additional class name
   */
  className?: string;
  /**
   * @description The placement of the tooltip
   * @enum ['top', 'left', 'right', 'bottom', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'leftTop', 'leftBottom', 'rightTop', 'rightBottom']
   * @default 'right'
   */
  placement?: TooltipProps['placement'];
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
      placement={placement}
      title={copied ? '✅ Success' : 'Copy'}
      icon={Copy}
      className={className}
      size={size}
      glass
      onClick={() => {
        copy(content);
        setCopied();
      }}
    />
  );
};

export default CopyButton;
