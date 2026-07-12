import './home.css';

import { GithubIcon } from '@lobehub/ui/icons/lucideExtra';
import { ArrowRight, Palette, SunMoon, Zap } from 'lucide-react';
import type { MetaFunction } from 'react-router';
import { Link } from 'react-router';

import CopyControl from '../../components/CopyControl/CopyControl';
import { sectionLandingPathname } from '../../content/pageChrome';
import { siteMetadata } from '../../content/siteMetadata';
import { contentManifest, findDocument } from '../content/registry';

const INSTALL_COMMAND = 'bun add @lobehub/ui';

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
] as const;

export const meta: MetaFunction = () => {
  const document = findDocument('/');
  const title = document ? `${document.title} - ${siteMetadata.name}` : siteMetadata.name;
  const description = document?.description ?? siteMetadata.description;
  const canonicalUrl = new URL('/', siteMetadata.origin).href;

  return [
    { title },
    { content: description, name: 'description' },
    { href: canonicalUrl, rel: 'canonical', tagName: 'link' },
    { content: 'website', property: 'og:type' },
    { content: siteMetadata.name, property: 'og:site_name' },
    { content: title, property: 'og:title' },
    { content: description, property: 'og:description' },
    { content: canonicalUrl, property: 'og:url' },
    { content: siteMetadata.openGraphImage, property: 'og:image' },
    { content: 'summary_large_image', name: 'twitter:card' },
  ];
};

export default function Home() {
  const document = findDocument('/');
  const firstSection = contentManifest.navigation[0];
  const getStartedPathname = firstSection ? sectionLandingPathname(firstSection) : '/changelog';

  return (
    <main className="home" id="docs-content">
      <article data-pagefind-body className="home__document">
        <section className="home__hero">
          <h1 data-pagefind-meta="title">
            LobeHub <span className="home__hero-gradient">UI Kit</span>
          </h1>
          <p data-pagefind-meta="description">
            {document?.description ?? siteMetadata.description}
          </p>
          <div className="home__hero-actions">
            <a
              className="home__button home__button--primary"
              href="https://github.com/lobehub/lobe-ui"
              rel="noreferrer"
              target="_blank"
            >
              <GithubIcon aria-hidden size={16} strokeWidth={1.8} />
              GitHub
            </a>
            <Link className="home__button" to={getStartedPathname}>
              Get Started
              <ArrowRight aria-hidden size={16} strokeWidth={1.8} />
            </Link>
          </div>
        </section>

        <section aria-labelledby="home-install" className="home__install">
          <h2 id="home-install">Start building your AIGC app now</h2>
          <div className="home__install-command">
            <code>{INSTALL_COMMAND}</code>
            <CopyControl label="Copy install command" value={INSTALL_COMMAND} />
          </div>
        </section>

        <section aria-label="Library highlights" className="home__features">
          {features.map(({ description, icon: FeatureIcon, title }) => (
            <div className="home__feature" key={title}>
              <span className="home__feature-icon">
                <FeatureIcon aria-hidden size={16} strokeWidth={1.7} />
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </section>

        <footer className="home__footer">
          <span>© {new Date().getFullYear()} LobeHub</span>
          <nav aria-label="Footer">
            <a href="https://github.com/lobehub/lobe-ui" rel="noreferrer" target="_blank">
              GitHub
            </a>
            <a href="https://www.npmjs.com/package/@lobehub/ui" rel="noreferrer" target="_blank">
              NPM
            </a>
            <a href="https://lobehub.com" rel="noreferrer" target="_blank">
              LobeHub
            </a>
            <Link to="/changelog">Changelog</Link>
          </nav>
        </footer>
      </article>
    </main>
  );
}
