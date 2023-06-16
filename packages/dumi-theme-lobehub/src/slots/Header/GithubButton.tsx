import { ActionIcon } from '@lobehub/ui';
import { Github } from 'lucide-react';
import { memo } from 'react';

import { githubSel, useSiteStore } from '@/store';

const GithubButton = memo(() => {
  const repoUrl = useSiteStore(githubSel);

  return repoUrl ? (
    <a href={repoUrl} rel="noreferrer" target={'_blank'}>
      <ActionIcon icon={Github} size="site" />
    </a>
  ) : undefined;
});

export default GithubButton;
