import { useSiteStore } from '@/store/useSiteStore';
import { Logo as SiteLogo } from '@lobehub/ui';
import { useResponsive } from 'antd-style';
import { Link } from 'dumi';
import isEqual from 'fast-deep-equal';
import { memo } from 'react';
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
            <img src={themeConfig.logo} height={mobile ? 32 : 36} />
            {themeConfig.name}
          </>
        ) : (
          <SiteLogo type="combine" size={mobile ? 32 : 36} extra={themeConfig.name} />
        )}
      </Link>
    )
  );
});

export default Logo;
