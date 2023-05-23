import { FC } from 'react';

import { Highlighter } from '@lobehub/ui';

interface SourceCodeProps {
  lang: string;
  children: string;
}

const SourceCode: FC<SourceCodeProps> = ({ children, lang }) => {
  return <Highlighter language={lang}>{children}</Highlighter>;
};

export default SourceCode;
