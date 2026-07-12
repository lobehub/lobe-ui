import { Link } from 'react-router';

import { styles } from './style';

const externalLinkProps = { rel: 'noreferrer', target: '_blank' } as const;

export default function Footer() {
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
        <a
          className={styles.external}
          href="https://github.com/lobehub/lobe-ui"
          {...externalLinkProps}
        >
          GitHub
        </a>
        <a
          className={styles.external}
          href="https://www.npmjs.com/package/@lobehub/ui"
          {...externalLinkProps}
        >
          NPM
        </a>
        <Link to="/changelog">Changelog</Link>
      </nav>
    </footer>
  );
}
