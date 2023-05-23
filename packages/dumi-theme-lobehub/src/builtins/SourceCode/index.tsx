import { Highlighter } from '@lobehub/ui';
import { useTheme } from 'antd-style';
import { rgba } from 'polished';
import { FC } from 'react';

interface SourceCodeProps {
  lang: string;
  children: string;
}

const SourceCode: FC<SourceCodeProps> = ({ children, lang }) => {
  const theme = useTheme();
  return (
    <Highlighter style={{ background: rgba(theme.colorBgLayout, 0.5) }} language={lang}>
      {children}
    </Highlighter>
  );
};

export default SourceCode;
