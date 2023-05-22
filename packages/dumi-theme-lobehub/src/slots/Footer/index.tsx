import { Divider } from 'antd';
import { useResponsive } from 'antd-style';
import { type FC } from 'react';
import { Center, Flexbox } from 'react-layout-kit';

import Foot, { FooterProps } from '@/components/Footer';
import { githubSel, useSiteStore } from '@/store';
import { IFooter } from '@/types';
import { getColumns } from './columns';
import { useStyles } from './style';

const Footer: FC = () => {
  const { themeConfig, pkg } = useSiteStore((s) => s.siteData);
  const githubUrl = useSiteStore(githubSel);

  const { styles, theme } = useStyles();
  const { mobile } = useResponsive();
  if (!themeConfig.footer) return null;

  const footer = themeConfig.footerConfig as IFooter;

  const columns =
    footer?.columns === false
      ? undefined
      : getColumns({ github: githubUrl || (pkg as any).homepage });

  const bottomFooter = footer?.bottom || themeConfig.footer;

  return (
    <Foot
      theme={footer?.theme || (theme.appearance as FooterProps['theme'])}
      columns={columns}
      bottom={
        mobile ? (
          <Center className={styles.container}>
            Copyright © 2022-{new Date().getFullYear()}
            <Flexbox
              align={'center'}
              horizontal
              dangerouslySetInnerHTML={{ __html: bottomFooter }}
            ></Flexbox>
          </Center>
        ) : (
          <Center horizontal>
            Copyright © 2022-{new Date().getFullYear()} <Divider type={'vertical'} />
            <span dangerouslySetInnerHTML={{ __html: bottomFooter }} />
          </Center>
        )
      }
    />
  );
};

export default Footer;
