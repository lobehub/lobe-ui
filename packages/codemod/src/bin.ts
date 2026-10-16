#!/usr/bin/env node
import { main } from './cli';

main(process.argv.slice(2), {
  cwd: process.cwd(),
  log: (line) => process.stdout.write(`${line}\n`),
}).then(
  (code) => {
    process.exitCode = code;
  },
  (error) => {
    console.error(error);
    process.exitCode = 1;
  },
);
