'use client';

import './style.css';

import { GithubIcon } from '@lobehub/ui/icons';
import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { memo, useCallback } from 'react';

import A from '@/A';
import AuroraBackground from '@/awesome/AuroraBackground';
import GradientButton from '@/awesome/GradientButton';
import Button from '@/Button';
import { Center, Flexbox } from '@/Flex';
import Icon from '@/Icon';
import { useResponsive } from '@/styles/theme/scope';

import { styles } from './style';
import { type HeroProps } from './type';

const Hero = memo<HeroProps>(({ title, description, actions, Link }) => {
  const { mobile } = useResponsive();

  const LinkRender = Link || A;

  const ButtonGroups = useCallback(
    () =>
      Boolean(actions?.length) && (
        <div className={clsx(stylex.props(styles.actions).className, 'lobe-hero-actions')}>
          {actions!.map(({ text, link, openExternal, github, type }, index) => {
            const content =
              type === 'primary' ? (
                <GradientButton
                  block={mobile}
                  icon={github ? <Icon icon={GithubIcon} size={18} /> : undefined}
                  key={index}
                  size="large"
                >
                  {text}
                </GradientButton>
              ) : (
                <Button
                  block={mobile}
                  icon={github ? <Icon icon={GithubIcon} size={18} /> : undefined}
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
        </div>
      ),
    [actions],
  );

  return (
    <>
      <AuroraBackground />
      <Flexbox align={'center'} style={{ fontSize: 16, zIndex: 1 }}>
        <Flexbox
          horizontal
          className={stylex.props(styles.container).className}
          distribution={'center'}
        >
          <Center>
            {title && (
              <Center
                horizontal
                as={'h1'}
                className={clsx(stylex.props(styles.title).className, 'lobe-hero-title')}
                dangerouslySetInnerHTML={{ __html: title }}
                gap={'0.25em'}
                wrap={'wrap'}
              />
            )}
            {description && (
              <p {...stylex.props(styles.desc)} dangerouslySetInnerHTML={{ __html: description }} />
            )}
            <ButtonGroups />
          </Center>
        </Flexbox>
      </Flexbox>
    </>
  );
});

Hero.displayName = 'Hero';

export default Hero;
