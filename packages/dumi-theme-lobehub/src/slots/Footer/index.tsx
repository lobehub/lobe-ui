import { Footer as Foot, FooterProps } from '@lobehub/ui';
import { Divider } from 'antd';
import { useResponsive } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { memo } from 'react';
import { Center, Flexbox } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';

import { githubSel, useSiteStore } from '@/store';
import { IFooter } from '@/types';

import { getColumns } from './columns';
import { useStyles } from './style';

const Footer = memo(() => {
  const { themeConfig, pkg } = useSiteStore((s) => s.siteData, isEqual);
  const githubUrl = useSiteStore(githubSel, shallow);
  const { styles, theme } = useStyles();
  const { mobile } = useResponsive();

  if (!themeConfig.footer) return;

  const footer = themeConfig.footerConfig as IFooter;

  const columns =
    footer?.columns === false
      ? undefined
      : getColumns({ github: githubUrl || (pkg as any).homepage });

  const bottomFooter = footer?.bottom || themeConfig.footer;

  return (
    <Foot
      bottom={
        mobile ? (
          <Center className={styles.container}>
            Copyright © 2022-{new Date().getFullYear()}
            <Flexbox
              align={'center'}
              dangerouslySetInnerHTML={{ __html: bottomFooter }}
              horizontal
            ></Flexbox>
          </Center>
        ) : (
          <Center horizontal>
            Copyright © 2022-{new Date().getFullYear()} <Divider type={'vertical'} />
            <span dangerouslySetInnerHTML={{ __html: bottomFooter }} />
          </Center>
        )
      }
      columns={columns}
      contentMaxWidth={theme.contentMaxWidth}
      theme={footer?.theme || (theme.appearance as FooterProps['theme'])}
    />
  );
});

export default Footer;
