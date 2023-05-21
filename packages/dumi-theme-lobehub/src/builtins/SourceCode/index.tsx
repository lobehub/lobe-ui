import { FC } from 'react';

import { Highlighter } from '@/components/Highlighter';
import { useSiteStore } from '@/store';

interface SourceCodeProps {
  lang: string;
  children: string;
}

const SourceCode: FC<SourceCodeProps> = ({ children, lang }) => {
  const theme = useSiteStore((s) => s.siteData.themeConfig.syntaxTheme);

  return (
    <Highlighter syntaxThemes={theme} language={lang}>
      {children}
    </Highlighter>
  );
};

export default SourceCode;
