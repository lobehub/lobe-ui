'use client';

import './style.css';

import { GithubIcon } from '@lobehub/ui/icons';
import clsx from 'clsx';
import { memo, useCallback } from 'react';

import A from '@/A';
import AuroraBackground from '@/awesome/AuroraBackground';
import GradientButton from '@/awesome/GradientButton';
import Button from '@/Button';
import { Center, Flexbox } from '@/Flex';
import Icon from '@/Icon';
import { styleProps } from '@/styles/stylex/props';
import { useResponsive } from '@/styles/theme/scope';

import { awesomeHeroClasses } from './stable';
import { styles } from './style';
import { type HeroProps } from './type';

const Hero = memo<HeroProps>(({ className, title, description, actions, Link }) => {
  const { mobile } = useResponsive();

  const LinkRender = Link || A;

  const ButtonGroups = useCallback(
    () =>
      Boolean(actions?.length) && (
        <div
          className={clsx(
            styleProps(styles.actions, awesomeHeroClasses('actions')).className,
            'lobe-hero-actions',
          )}
        >
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
      <AuroraBackground className={awesomeHeroClasses('background')} />
      <Flexbox align={'center'} {...styleProps(styles.root, clsx(awesomeHeroClasses(), className))}>
        <Flexbox
          horizontal
          className={styleProps(styles.container, awesomeHeroClasses('container')).className}
          distribution={'center'}
        >
          <Center>
            {title && (
              <Center
                horizontal
                as={'h1'}
                dangerouslySetInnerHTML={{ __html: title }}
                gap={'0.25em'}
                wrap={'wrap'}
                className={clsx(
                  styleProps(styles.title, awesomeHeroClasses('title')).className,
                  'lobe-hero-title',
                )}
              />
            )}
            {description && (
              <p
                {...styleProps(styles.desc, awesomeHeroClasses('description'))}
                dangerouslySetInnerHTML={{ __html: description }}
              />
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
