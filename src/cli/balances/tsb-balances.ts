#!/usr/bin/env node

import { program } from 'commander';
import path from 'path';

const pathToList = path.resolve(__dirname, './tsb-balances-list.js');

program.command('list', 'List balances', { executableFile: pathToList });
program.action(() => {
  program.help();
});
program.parse(process.argv);
