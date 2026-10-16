import * as stylex from '@stylexjs/stylex';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import siteConfig from 'virtual:lobedocs/site-config';

import type { DocsNavItem } from '../../../src/config';
import { CopyControl } from '../CopyControl/CopyControl';
import { homeIcons } from './homeIcons';
import { styles } from './homeStyle';

const externalLinkProps = { rel: 'noreferrer', target: '_blank' } as const;

const HeroAction = ({ action, primary }: { action: DocsNavItem; primary: boolean }) => {
  const buttonProps = stylex.props(styles.button, primary && styles.buttonPrimary);

  if (action.external) {
    return (
      <a {...buttonProps} href={action.href} {...externalLinkProps}>
        {action.label}
      </a>
    );
  }

  return (
    <Link {...buttonProps} to={action.href}>
      {action.label}
    </Link>
  );
};

export const DefaultHome = ({
  description,
  getStartedPathname,
}: {
  description: string;
  getStartedPathname: string;
}) => {
  const home = siteConfig.themeConfig?.home;
  const heroActions = home?.hero?.actions ?? [{ href: getStartedPathname, label: 'Get Started' }];
  const features = home?.features ?? [];

  return (
    <>
      <section {...stylex.props(styles.hero)}>
        <h1 data-pagefind-meta="title" {...stylex.props(styles.heroTitle, styles.heroEnter)}>
          {home?.hero?.title ?? siteConfig.title}
          {home?.hero?.accent && (
            <>
              {' '}
              <span {...stylex.props(styles.heroGradient)}>{home.hero.accent}</span>
            </>
          )}
        </h1>
        <p
          data-pagefind-meta="description"
          {...stylex.props(styles.heroDescription, styles.heroEnter, styles.heroEnterSecond)}
        >
          {description}
        </p>
        <div {...stylex.props(styles.heroActions, styles.heroEnter, styles.heroEnterThird)}>
          {heroActions.map((action, index) => (
            <HeroAction action={action} key={action.href} primary={index === 0} />
          ))}
        </div>
      </section>

      {features.length > 0 && (
        <section aria-label="Features" {...stylex.props(styles.features)}>
          <div {...stylex.props(styles.featuresGrid)}>
            {features.map(({ description: featureDescription, icon, title }) => {
              const FeatureIcon = icon ? homeIcons[icon] : undefined;

              return (
                <div {...stylex.props(styles.feature)} key={title}>
                  {FeatureIcon && (
                    <span {...stylex.props(styles.featureIcon)}>
                      <FeatureIcon aria-hidden size={16} strokeWidth={1.7} />
                    </span>
                  )}
                  <h3 {...stylex.props(styles.featureTitle)}>{title}</h3>
                  <p {...stylex.props(styles.featureDescription)}>{featureDescription}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {home?.install && (
        <section aria-labelledby="home-install" {...stylex.props(styles.cta)}>
          <h2 id="home-install" {...stylex.props(styles.ctaTitle)}>
            {home.ctaTitle ?? 'Get started in seconds'}
          </h2>
          <div {...stylex.props(styles.installCommand)}>
            <code {...stylex.props(styles.installCode)}>{home.install}</code>
            <CopyControl label="Copy install command" value={home.install} />
          </div>
          <p {...stylex.props(styles.ctaFootnote)}>
            {home.ctaFootnote && <>{home.ctaFootnote} · </>}
            <Link {...stylex.props(styles.ctaLink)} to={getStartedPathname}>
              Get Started <ArrowRight aria-hidden size={12} strokeWidth={1.8} />
            </Link>
          </p>
        </section>
      )}
    </>
  );
};

export default DefaultHome;
