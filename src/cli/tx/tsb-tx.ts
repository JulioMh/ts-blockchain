#!/usr/bin/env node

import { program } from 'commander';
import path from 'path';

const pathToAdd = path.resolve(__dirname, './tsb-tx-add.js');

program.command('add', 'Add a new transcation', { executableFile: pathToAdd });
program.action(() => {
  program.help();
});
program.parse(process.argv);
