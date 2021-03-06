#!/usr/bin/env node

import { program } from 'commander';
import path from 'path';

const pathToRun = path.resolve(__dirname, './tsb-node-run.js');
const pathToStop = path.resolve(__dirname, './tsb-node-stop.js');

program
  .command('run', 'Run a new sync-blockchain node', { executableFile: pathToRun })
  .command('stop', 'Stop a given node', { executableFile: pathToStop });
program.action(() => {
  program.help();
});
program.parse(process.argv);
