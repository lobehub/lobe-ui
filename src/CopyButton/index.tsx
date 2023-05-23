import { ActionIcon, ActionIconSize, Tooltip, TooltipProps } from '@/index';

import copy from 'copy-to-clipboard';
import { Copy } from 'lucide-react';
import { ReactNode } from 'react';

import { useCopied } from '@/hooks/useCopied';

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
  /**
   * @description A function that returns the children to be rendered

   */
  render?: (props: { handleCopy: () => void }) => ReactNode;
}

const CopyButton = ({
  content,
  className,
  placement = 'right',
  size = 'site',
  render,
  ...props
}: CopyButtonProps) => {
  const { copied, setCopied } = useCopied();

  const handleCopy = () => {
    copy(content);
    setCopied();
  };

  const children = render ? (
    render({ handleCopy })
  ) : (
    <ActionIcon
      {...props}
      icon={Copy}
      className={className}
      size={size}
      onClick={() => {
        copy(content);
        setCopied();
      }}
    />
  );

  return (
    <Tooltip arrow={false} placement={placement} title={copied ? <>✅ Success</> : 'Copy'}>
      {children}
    </Tooltip>
  );
};

export default CopyButton;
