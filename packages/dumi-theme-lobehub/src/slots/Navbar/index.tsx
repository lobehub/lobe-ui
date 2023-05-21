import { Tabs } from 'antd';
import { createStyles } from 'antd-style';
import { history, Link } from 'dumi';
import NavbarExtra from 'dumi/theme-default/slots/NavbarExtra';
import { memo, type FC } from 'react';
import { shallow } from 'zustand/shallow';
import { activePathSel, useSiteStore } from '../../store';

const useStyles = createStyles(({ css, responsive, token, stylish, prefixCls }) => {
  const prefix = `.${prefixCls}-tabs`;

  const marginHoriz = 16;
  const paddingVertical = 6;

  return {
    tabs: css`
      ${prefix}-tab + ${prefix}-tab {
        margin: ${marginHoriz}px 4px !important;
        padding: 0 12px !important;
      }

      ${prefix}-tab {
        color: ${token.colorTextSecondary};
        transition: background-color 100ms ease-out;

        &:first-child {
          margin: ${marginHoriz}px 4px ${marginHoriz}px 0;
          padding: ${paddingVertical}px 12px !important;
        }

        &:hover {
          color: ${token.colorText} !important;
          background: ${token.colorFillTertiary};
          border-radius: ${token.borderRadius}px;
        }
      }

      ${prefix}-nav {
        margin-bottom: 0;
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
const Navbar: FC = () => {
  const { styles } = useStyles();

  const nav = useSiteStore((s) => s.navData, shallow);
  const activePath = useSiteStore(activePathSel);

  return (
    <>
      <Tabs
        onChange={(path) => {
          const url = nav.find((i) => i.activePath === path || i.link === path)?.link;
          if (!url) return;
          history.push(url);
        }}
        activeKey={activePath}
        className={styles.tabs}
        items={nav.map((item) => ({
          label: (
            <Link className={styles.link} to={item.link}>
              {item.title}
            </Link>
          ),
          key: item.activePath! || item.link,
        }))}
      />

      <NavbarExtra />
    </>
  );
};

export default memo(Navbar);
