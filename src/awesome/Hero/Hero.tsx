'use client';

import { ConfigProvider } from 'antd';
import { useResponsive } from 'antd-style';
import { Github } from 'lucide-react';
import { memo, useCallback } from 'react';

import A from '@/A';
import Button from '@/Button';
import { Center, Flexbox } from '@/Flex';
import AuroraBackground from '@/awesome/AuroraBackground';
import GradientButton from '@/awesome/GradientButton';

import { useStyles } from './style';
import type { HeroProps } from './type';

const Hero = memo<HeroProps>(({ title, description, actions, Link }) => {
  const { styles } = useStyles();
  const { mobile } = useResponsive();

  const LinkRender = Link || A;

  const ButtonGroups = useCallback(
    () =>
      Boolean(actions?.length) && (
        <Flexbox className={styles.actions} gap={16} horizontal justify={'center'}>
          {actions!.map(({ text, link, openExternal, github, type }, index) => {
            const content =
              type === 'primary' ? (
                <GradientButton
                  block={mobile}
                  icon={github ? Github : undefined}
                  key={index}
                  size="large"
                >
                  {text}
                </GradientButton>
              ) : (
                <Button
                  block={mobile}
                  icon={github ? Github : undefined}
                  key={index}
                  size="large"
                  type="primary"
                >
                  {text}
                </Button>
              );

            return openExternal ? (
              <A href={link} key={text} target={openExternal ? '_blank' : undefined}>
                {content}
              </A>
            ) : (
              <LinkRender key={text} to={link}>
                {content}
              </LinkRender>
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

Hero.displayName = 'Hero';

export default Hero;
