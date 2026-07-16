import { Link } from 'react-router';
import siteConfig from 'virtual:lobedocs/site-config';

import { styles } from './style';

const externalLinkProps = { rel: 'noreferrer', target: '_blank' } as const;

export function Footer() {
  const socialLinks = siteConfig.themeConfig?.socialLinks ?? [];

  return (
    <footer className={styles.root} data-pagefind-ignore="all">
      <span className={styles.colophon}>
        <span>Copyright © 2022–{new Date().getFullYear()}</span>
        <span aria-hidden className={styles.dot}>
          ·
        </span>
        <span>
          Made with 🤯 by{' '}
          <a className={styles.external} href="https://lobehub.com" {...externalLinkProps}>
            LobeHub
          </a>
        </span>
      </span>
      <nav aria-label="Footer">
        {socialLinks.map((link) => (
          <a className={styles.external} href={link.href} key={link.label} {...externalLinkProps}>
            {link.label}
          </a>
        ))}
        <Link to="/changelog">Changelog</Link>
      </nav>
    </footer>
  );
}
