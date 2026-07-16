import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import siteConfig from 'virtual:lobedocs/site-config';

import type { DocsNavItem } from '../../../src/config';
import { CopyControl } from '../CopyControl/CopyControl';
import { homeIcons } from './homeIcons';
import { styles } from './homeStyle';

const externalLinkProps = { rel: 'noreferrer', target: '_blank' } as const;

const HeroAction = ({ action, primary }: { action: DocsNavItem; primary: boolean }) => {
  const className = primary ? `${styles.button} ${styles.buttonPrimary}` : styles.button;

  if (action.external) {
    return (
      <a className={className} href={action.href} {...externalLinkProps}>
        {action.label}
      </a>
    );
  }

  return (
    <Link className={className} to={action.href}>
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
    <main className={styles.root} id="docs-content">
      <article data-pagefind-body className={styles.document}>
        <section className={styles.hero}>
          <h1 data-pagefind-meta="title">
            {home?.hero?.title ?? siteConfig.title}
            {home?.hero?.accent && (
              <>
                {' '}
                <span className={styles.heroGradient}>{home.hero.accent}</span>
              </>
            )}
          </h1>
          <p data-pagefind-meta="description">{description}</p>
          <div className={styles.heroActions}>
            {heroActions.map((action, index) => (
              <HeroAction action={action} key={action.href} primary={index === 0} />
            ))}
          </div>
        </section>

        {features.length > 0 && (
          <section aria-label="Features" className={styles.features}>
            <div className={styles.featuresGrid}>
              {features.map(({ description: featureDescription, icon, title }) => {
                const FeatureIcon = icon ? homeIcons[icon] : undefined;

                return (
                  <div className={styles.feature} key={title}>
                    {FeatureIcon && (
                      <span className={styles.featureIcon}>
                        <FeatureIcon aria-hidden size={16} strokeWidth={1.7} />
                      </span>
                    )}
                    <h3>{title}</h3>
                    <p>{featureDescription}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {home?.install && (
          <section aria-labelledby="home-install" className={styles.cta}>
            <h2 id="home-install">{home.ctaTitle ?? 'Get started in seconds'}</h2>
            <div className={styles.installCommand}>
              <code>{home.install}</code>
              <CopyControl label="Copy install command" value={home.install} />
            </div>
            <p className={styles.ctaFootnote}>
              {home.ctaFootnote && <>{home.ctaFootnote} · </>}
              <Link to={getStartedPathname}>
                Get Started <ArrowRight aria-hidden size={12} strokeWidth={1.8} />
              </Link>
            </p>
          </section>
        )}
      </article>
    </main>
  );
};

export default DefaultHome;
