'use client';

import { Button, ConfigProvider } from 'antd';
import { useResponsive } from 'antd-style';
import { Link } from 'dumi';
import { Github } from 'lucide-react';
import { memo, useCallback } from 'react';
import { Center, Flexbox } from 'react-layout-kit';

import A from '@/A';
import AuroraBackground from '@/AuroraBackground';
import GradientButton from '@/GradientButton';
import Icon from '@/Icon';

import { useStyles } from './style';

export interface HeroAction {
  /**
   * @description Icon name from LucideIcon package
   */
  icon?: string;
  /**
   * @description Link to be redirected to on button click
   */
  link: string;
  /**
   * @description Whether to open the link in a new tab
   * @default false
   */
  openExternal?: boolean;
  /**
   * @description Text to be displayed on the button
   */
  text: string;
  /**
   * @description Type of button
   * @default 'default'
   */
  type?: 'primary' | 'default';
}

export interface HeroProps {
  /**
   * @description Array of action buttons to be displayed
   * @default []
   */
  actions?: HeroAction[];
  /**
   * @description Short description to be displayed
   */
  description?: string;
  /**
   * @description Title to be displayed
   */
  title?: string;
}

const Hero = memo<HeroProps>(({ title, description, actions }) => {
  const { styles } = useStyles();
  const { mobile } = useResponsive();

  const ButtonGroups = useCallback(
    () =>
      Boolean(actions?.length) && (
        <Flexbox className={styles.actions} gap={24} horizontal justify={'center'}>
          {actions!.map(({ text, link, openExternal, icon, type }, index) => {
            // @ts-ignore
            const ButtonIcon = icon === 'Github' ? <Icon icon={Github} /> : icon;
            const content =
              type === 'primary' ? (
                <GradientButton block={mobile} icon={ButtonIcon} key={index} size="large">
                  {text}
                </GradientButton>
              ) : (
                <Button block={mobile} icon={ButtonIcon} key={index} size="large" type="primary">
                  {text}
                </Button>
              );

            return openExternal ? (
              <A
                href={link}
                key={text}
                rel="noreferrer"
                target={openExternal ? '_blank' : undefined}
              >
                {content}
              </A>
            ) : (
              <Link key={text} to={link}>
                {content}
              </Link>
            );
          })}
        </Flexbox>
      ),
    [actions],
  );

  return (
    <>
      <AuroraBackground />
      <ConfigProvider theme={{ token: { fontSize: 16 } }}>
        <Flexbox align={'center'} style={{ zIndex: 1 }}>
          <Flexbox className={styles.container} distribution={'center'} horizontal>
            <Center>
              {title && (
                <Center
                  as={'h1'}
                  className={styles.title}
                  dangerouslySetInnerHTML={{ __html: title }}
                  gap={'0.25em'}
                  horizontal
                  wrap={'wrap'}
                />
              )}
              {description && (
                <p className={styles.desc} dangerouslySetInnerHTML={{ __html: description }} />
              )}
              <ButtonGroups />
            </Center>
          </Flexbox>
        </Flexbox>
      </ConfigProvider>
    </>
  );
});

export default Hero;
