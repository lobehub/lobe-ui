import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { getThemeCss } from '../src/styles/theme/themeCss';

writeFileSync(fileURLToPath(new URL('../es/theme.css', import.meta.url)), `${getThemeCss()}\n`);
