import { memo, useMemo } from 'react';

import { ApiHeader as Header } from '@/components/ApiHeader';
import { apiHeaderSel, useSiteStore } from '@/store';

import BundlephobiaFilled from './BundlephobiaFilled';
import Graph from './Graph';
import NpmFilled from './NpmFilled';
import PackagePhobia from './PackagePhobia';
import Unpkg from './Unpkg';

const ApiHeader = memo(() => {
  const props = useSiteStore(apiHeaderSel);
  const { pkg } = props;

  const packages = useMemo(
    () => [
      {
        label: 'NPM',
        icon: <NpmFilled />,
        children: 'NPM',
        url: `https://www.npmjs.com/package/${pkg}`,
      },
      {
        label: 'Check package files',
        icon: <Unpkg />,
        children: 'UNPKG',
        url: `https://unpkg.com/browse/${pkg}/`,
      },
      {
        label: 'Check bundle size',
        icon: <BundlephobiaFilled />,
        children: 'BundlePhobia',
        url: `https://bundlephobia.com/package/${pkg}`,
      },
      {
        label: 'Check package size',
        icon: <PackagePhobia />,
        children: 'PackagePhobia',
        url: `https://packagephobia.com/result?p=${pkg}`,
      },

      {
        label: 'Dependence graph',
        icon: <Graph />,
        children: 'Anvaka Graph',
        url: `https://npm.anvaka.com/#/view/2d/${pkg}`,
      },
    ],
    [pkg],
  );

  return <Header serviceList={packages} {...props} />;
});

export default ApiHeader;
