import { githubSel, useSiteStore } from '@/store';
import { ActionIcon } from '@lobehub/ui';
import { Github } from 'lucide-react';
import { memo } from 'react';

const GithubButton = memo(() => {
  const repoUrl = useSiteStore(githubSel);

  return !repoUrl ? null : (
    <a href={repoUrl} target={'_blank'} rel="noreferrer">
      <ActionIcon size="site" icon={Github} />
    </a>
  );
});

export default GithubButton;
