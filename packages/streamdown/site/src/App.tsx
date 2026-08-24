import { ApiSection } from './sections/ApiSection';
import { Features } from './sections/Features';
import { Hero } from './sections/Hero';
import { Playground } from './sections/Playground';

const REPO = 'https://github.com/lobehub/lobe-ui/tree/master/packages/streamdown';
const NPM = 'https://www.npmjs.com/package/@lobehub/streamdown';

export const App = () => (
  <>
    <header className="site-header">
      <div className="wrap">
        <nav className="nav">
          <span className="nav-mark">Streamdown</span>
          <span className="nav-badge">@lobehub/streamdown</span>
          <span className="nav-spacer" />
          <a href="#playground">Playground</a>
          <a href="#api">API</a>
          <a href={REPO}>GitHub</a>
        </nav>
      </div>
    </header>

    <div className="wrap">
      <Hero />
      <Features />
      <Playground />
      <ApiSection />

      <footer className="site-footer">
        <span>MIT © LobeHub</span>
        <a href={REPO}>GitHub</a>
        <a href={NPM}>npm</a>
        <span className="nav-spacer" />
        <span>Headless by design</span>
      </footer>
    </div>
  </>
);
