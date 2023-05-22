import { ActionIcon } from '@lobehub/ui';
import { Github } from 'lucide-react';
import { memo, type FC } from 'react';

import { githubSel, useSiteStore } from '@/store';

const GithubButton: FC = () => {
  const repoUrl = useSiteStore(githubSel);

  return !repoUrl ? null : (
    <a href={repoUrl} target={'_blank'} rel="noreferrer">
      <ActionIcon size="site" icon={Github} />
    </a>
  );
};

export default memo(GithubButton);
