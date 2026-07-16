import { fileURLToPath } from 'node:url';

import { commands, createCliContext } from './commands';

const kitRoot = fileURLToPath(new URL('../..', import.meta.url));
const cwd = process.cwd();
const context = createCliContext(kitRoot, cwd);

const [command, ...args] = process.argv.slice(2);
const handler = command ? commands[command as keyof typeof commands] : undefined;

if (!handler) {
  console.error(`Unknown lobedocs command: ${command ?? '<none>'}`);
  console.error(`Usage: lobedocs <${Object.keys(commands).join('|')}> [...args]`);
  process.exit(1);
}

try {
  await handler(context, args);
} catch (error) {
  console.error(error);
  process.exit(1);
}
