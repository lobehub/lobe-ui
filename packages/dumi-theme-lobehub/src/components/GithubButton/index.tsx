import { GithubFilled } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { memo, type FC } from 'react';

import { githubSel, useSiteStore } from '../../store';

const GithubButton: FC = () => {
  const repoUrl = useSiteStore(githubSel);

  return !repoUrl ? null : (
    <Tooltip arrow={false} title={'Github'}>
      <a href={repoUrl} target={'_blank'} rel="noreferrer">
        <Button icon={<GithubFilled />} />
      </a>
    </Tooltip>
  );
};

export default memo(GithubButton);
