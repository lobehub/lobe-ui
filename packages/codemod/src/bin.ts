#!/usr/bin/env node
import { main } from './cli';

main(process.argv.slice(2), {
  cwd: process.cwd(),
  log: (line) => process.stdout.write(`${line}\n`),
}).then(
  (code) => process.exit(code),
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
