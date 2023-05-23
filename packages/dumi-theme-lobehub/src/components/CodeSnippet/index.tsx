import { useCopied } from '@/hooks/useCopied';
import { CheckOutlined } from '@ant-design/icons';
import { Highlighter } from '@lobehub/ui';
import { Tooltip } from 'antd';
import { useResponsive } from 'antd-style';
import copy from 'copy-to-clipboard';
import { FC } from 'react';
import { useStyles } from './style';

const CodeSnippet: FC<{ children: string }> = ({ children }) => {
  const { styles, theme } = useStyles();
  const { mobile } = useResponsive();
  const { copied, setCopied } = useCopied();

  return (
    <Tooltip
      placement={mobile ? undefined : 'right'}
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
      <div
        className={styles}
        onClick={() => {
          copy(children);
          setCopied();
        }}
      >
        <Highlighter showLanguage={false} background={false} language={'tsx'} copyable={false}>
          {children}
        </Highlighter>
      </div>
    </Tooltip>
  );
};

export default CodeSnippet;
