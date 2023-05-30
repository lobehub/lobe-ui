import { Highlighter } from '@lobehub/ui';
import { useTheme } from 'antd-style';
import { rgba } from 'polished';
import { FC } from 'react';

interface SourceCodeProps {
  children: string;
  lang: string;
}

const SourceCode: FC<SourceCodeProps> = ({ children, lang }) => {
  const theme = useTheme();
  return (
    <Highlighter language={lang} style={{ background: rgba(theme.colorBgLayout, 0.5) }}>
      {children}
    </Highlighter>
  );
};

export default SourceCode;
