import { TabsNav } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { Link, history } from 'dumi';
import NavbarExtra from 'dumi/theme-default/slots/NavbarExtra';
import { memo } from 'react';
import { shallow } from 'zustand/shallow';

import { activePathSel, useSiteStore } from '@/store';

const useStyles = createStyles(({ css, stylish, token, responsive }) => {
  return {
    tabs: css`
      .ant-tabs-tab-active a {
        color: ${token.colorText} !important;
      }
      ${responsive.mobile} {
        display: none;
      }
    `,
    link: css`
      ${stylish.resetLinkColor}
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
          label: (
            <Link className={styles.link} to={String(item.link)}>
              {item.title}
            </Link>
          ),
          key: String(item.activePath! || item.link),
        }))}
        onChange={(path) => {
          const url = nav.find((i) => i.activePath === path || i.link === path)?.link;

          if (!url) return;

          history.push(url);
        }}
      />
      <NavbarExtra />
    </>
  );
});

export default Navbar;
