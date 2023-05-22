import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Tooltip, TooltipProps } from 'antd';
import { useTheme } from 'antd-style';
import { ButtonSize, ButtonType } from 'antd/es/button';
import copy from 'copy-to-clipboard';
import { ReactNode } from 'react';

import { useCopied } from '@/hooks/useCopied';

/**
 * @title 复制按钮属性
 */
interface CopyButtonProps {
  /**
   * @title 复制的内容
   */
  content: string;
  /**
   * @title 自定义类名
   */
  className?: string;
  /**
   * @title Tooltip 提示框位置
   * @enum ['top', 'left', 'right', 'bottom', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'leftTop', 'leftBottom', 'rightTop', 'rightBottom']
   * @enumNames ['上', '左', '右', '下', '左上', '右上', '左下', '右下', '左上', '左下', '右上', '右下']
   * @default 'top'
   */
  placement?: TooltipProps['placement'];
  type?: ButtonType;
  size?: ButtonSize;
  children?: ReactNode;
  render?: (props: { handleCopy: () => void }) => ReactNode;
}

const CopyButton = ({
  content,
  className,
  placement = 'right',
  type,
  size,
  render,
}: CopyButtonProps) => {
  const { copied, setCopied } = useCopied();

  const theme = useTheme();

  const handleCopy = () => {
    copy(content);
    setCopied();
  };

  const children = render ? (
    render({ handleCopy })
  ) : (
    <Button
      icon={<CopyOutlined />}
      className={className}
      type={type}
      size={size}
      onClick={() => {
        copy(content);
        setCopied();
      }}
    />
  );

  return (
    <ConfigProvider theme={{ token: { colorBgContainer: theme.colorBgElevated } }}>
      <Tooltip
        placement={placement}
        title={
          copied ? (
            <>
              <CheckOutlined style={{ color: theme.colorSuccess }} /> 复制成功
            </>
          ) : (
            '复制'
          )
        }
      >
        {children}
      </Tooltip>
    </ConfigProvider>
  );
};

export default CopyButton;
