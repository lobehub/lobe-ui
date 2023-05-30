import { activePathSel, useSiteStore } from '@/store';
import { TabsNav } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { Link, history } from 'dumi';
import NavbarExtra from 'dumi/theme-default/slots/NavbarExtra';
import { memo } from 'react';
import { shallow } from 'zustand/shallow';

const useStyles = createStyles(({ css, stylish, responsive }) => {
  return {
    tabs: css`
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
        onChange={(path) => {
          const url = nav.find((i) => i.activePath === path || i.link === path)?.link;
          if (!url) return;
          history.push(url);
        }}
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
      />
      <NavbarExtra />
    </>
  );
});

export default Navbar;
