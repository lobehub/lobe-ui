import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { getGlobalCss, getThemeCss } from '../src/styles/theme/themeCss';

const write = (name: string, css: string) =>
  writeFileSync(fileURLToPath(new URL(`../es/${name}`, import.meta.url)), `${css}\n`);

write('theme.css', getThemeCss());
write('global.css', getGlobalCss());
