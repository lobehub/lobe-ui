import { ApiHeader as Header } from '@/components/ApiHeader';
import { apiHeaderSel, useSiteStore } from '@/store';
import { memo, useMemo } from 'react';
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
        label: '预览产物',
        icon: <Unpkg />,
        children: 'UNPKG',
        url: `https://unpkg.com/browse/${pkg}/`,
      },
      {
        label: '查阅产物体积',
        icon: <BundlephobiaFilled />,
        children: 'BundlePhobia',
        url: `https://bundlephobia.com/package/${pkg}`,
      },
      {
        label: '查阅安装包体积',
        icon: <PackagePhobia />,
        children: 'PackagePhobia',
        url: `https://packagephobia.com/result?p=${pkg}`,
      },

      {
        label: '分析依赖图',
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
