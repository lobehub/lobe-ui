import { FC } from 'react';

import { ThemeProvider } from '../../components/DumiSiteProvider';
import { Highlighter } from '../../components/Highlighter';
import { useSiteStore } from '../../store';

interface SourceCodeProps {
  lang: string;
  children: string;
}

const SourceCode: FC<SourceCodeProps> = ({ children, lang }) => {
  const theme = useSiteStore((s) => s.siteData.themeConfig.syntaxTheme);

  return (
    <ThemeProvider>
      <Highlighter syntaxThemes={theme} language={lang}>
        {children}
      </Highlighter>
    </ThemeProvider>
  );
};

export default SourceCode;
