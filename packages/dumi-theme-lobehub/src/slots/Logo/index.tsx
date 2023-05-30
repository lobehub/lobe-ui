import { Logo as SiteLogo } from '@lobehub/ui';
import { useResponsive } from 'antd-style';
import { Link } from 'dumi';
import isEqual from 'fast-deep-equal';
import { memo } from 'react';

import { useSiteStore } from '@/store/useSiteStore';

import { useStyles } from './style';

const Logo = memo(() => {
  const themeConfig = useSiteStore((s) => s.siteData.themeConfig, isEqual);
  const locale = useSiteStore((s) => s.locale, isEqual);
  const { styles, cx } = useStyles();
  const { mobile } = useResponsive();

  return (
    themeConfig && (
      <Link className={cx(styles)} to={'base' in locale ? locale.base : '/'}>
        {themeConfig.logo ? (
          <>
            <img height={mobile ? 32 : 36} src={themeConfig.logo} />
            {themeConfig.name}
          </>
        ) : (
          <SiteLogo extra={themeConfig.name} size={mobile ? 32 : 36} type="combine" />
        )}
      </Link>
    )
  );
});

export default Logo;
