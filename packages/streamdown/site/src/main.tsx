import 'katex/dist/katex.min.css';
import './styles.css';

import { createRoot } from 'react-dom/client';

import { App } from './App';

createRoot(document.querySelector('#root')!).render(<App />);
