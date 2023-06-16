import { TabsNav } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { Link, history } from 'dumi';
import NavbarExtra from 'dumi/theme-default/slots/NavbarExtra';
import { memo } from 'react';
import { shallow } from 'zustand/shallow';

import { activePathSel, useSiteStore } from '@/store';

const useStyles = createStyles(({ css, stylish, token, responsive }) => {
  return {
    link: css`
      ${stylish.resetLinkColor}
    `,
    tabs: css`
      .ant-tabs-tab-active a {
        color: ${token.colorText} !important;
      }
      ${responsive.mobile} {
        display: none;
      }
    `,
  };
});
const Navbar = memo(() => {
  const { styles } = useStyles();

  const nav = useSiteStore((s) => s.navData, shallow);
  const activePath = useSiteStore(activePathSel);

  return (
    <>
      <TabsNav
        activeKey={activePath}
        className={styles.tabs}
        items={nav.map((item) => ({
          key: String(item.activePath! || item.link),
          label: (
            <Link className={styles.link} to={String(item.link)}>
              {item.title}
            </Link>
          ),
        }))}
        onChange={(path) => {
          const url = nav.find((index) => index.activePath === path || index.link === path)?.link;

          if (!url) return;

          history.push(url);
        }}
      />
      <NavbarExtra />
    </>
  );
});

export default Navbar;
