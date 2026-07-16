import { GithubIcon } from '@lobehub/ui/icons/lucideExtra';
import { ArrowRight, BookOpenText, Languages, Palette, Sparkles, SunMoon, Zap } from 'lucide-react';
import { Link } from 'react-router';

import { BentoGallery } from './BentoGallery';
import { CodeShowcase } from './CodeShowcase';
import { CopyControl } from './CopyControl';
import { HeroIconMarquee } from './HeroIconMarquee';
import { styles } from './homeStyle';

const INSTALL_COMMAND = 'bun add @lobehub/ui';
const ICONS_PATHNAME = '/components/icons/auth0';

const features = [
  {
    description:
      'Customize colors, typography, breakpoints, and other design foundations through the theme system.',
    icon: Palette,
    title: 'Themeable',
  },
  {
    description:
      'Avoid unnecessary style-prop processing at runtime while retaining a flexible component API.',
    icon: Zap,
    title: 'Fast',
  },
  {
    description:
      'Build interfaces that adapt consistently to light and dark appearance preferences.',
    icon: SunMoon,
    title: 'Light and dark UI',
  },
  {
    description:
      'Ship in 18 locales out of the box with I18nProvider, including RTL-aware layouts.',
    icon: Languages,
    title: 'i18n ready',
  },
  {
    description:
      'Render content-heavy pages with the bundled MDX components and typography styles.',
    icon: BookOpenText,
    title: 'MDX and docs',
  },
  {
    description:
      'Includes an AIGC-flavored icon set covering models, providers, and chat affordances.',
    icon: Sparkles,
    title: 'AIGC icons',
  },
] as const;

export default function Home({
  description,
  getStartedPathname,
}: {
  description: string;
  getStartedPathname: string;
}) {
  return (
    <>
      <section className={styles.hero}>
        <h1 data-pagefind-meta="title">
          LobeHub <span className={styles.heroGradient}>UI Kit</span>
        </h1>
        <p data-pagefind-meta="description">{description}</p>
        <div className={styles.heroActions}>
          <a
            className={`${styles.button} ${styles.buttonPrimary}`}
            href="https://github.com/lobehub/lobe-ui"
            rel="noreferrer"
            target="_blank"
          >
            <GithubIcon aria-hidden size={16} strokeWidth={1.8} />
            GitHub
          </a>
          <Link className={styles.button} to={getStartedPathname}>
            Get Started
            <ArrowRight aria-hidden size={16} strokeWidth={1.8} />
          </Link>
        </div>
        <HeroIconMarquee iconsPathname={ICONS_PATHNAME} />
      </section>

      <BentoGallery />

      <CodeShowcase />

      <section aria-labelledby="home-features" className={styles.features}>
        <h2 id="home-features">Everything an AIGC app needs</h2>
        <p>Design foundations that hold up beyond the demo.</p>
        <div className={styles.featuresGrid}>
          {features.map(({ description: featureDescription, icon: FeatureIcon, title }) => (
            <div className={styles.feature} key={title}>
              <span className={styles.featureIcon}>
                <FeatureIcon aria-hidden size={16} strokeWidth={1.7} />
              </span>
              <h3>{title}</h3>
              <p>{featureDescription}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="home-install" className={styles.cta}>
        <h2 id="home-install">Start building your AIGC app now</h2>
        <div className={styles.installCommand}>
          <code>{INSTALL_COMMAND}</code>
          <CopyControl label="Copy install command" value={INSTALL_COMMAND} />
        </div>
        <p className={styles.ctaFootnote}>
          Open source · MIT license ·{' '}
          <Link to={getStartedPathname}>
            Get Started <ArrowRight aria-hidden size={12} strokeWidth={1.8} />
          </Link>
        </p>
      </section>
    </>
  );
}
