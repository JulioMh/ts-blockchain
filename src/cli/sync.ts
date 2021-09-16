#!/usr/bin/env node

import { program } from 'commander';
import path from 'path';

const pathToTx = path.resolve(__dirname, './tx/sync-tx.js');
const pathToBalances = path.resolve(__dirname, './balances/sync-balances.js');
const pathToRun = path.resolve(__dirname, './node/sync-node.js');

program
  .version('0.0.1')
  .description('CLI to interact with centralized sync blockchain')
  .command('tx', 'Interact with transactions (add, ...)', { executableFile: pathToTx })
  .command('balances', 'Interact with balances (list, ...)', { executableFile: pathToBalances })
  .command('node', 'Run or stop a node', { executableFile: pathToRun })
  .action(() => {
    program.help();
  })
  .parse(process.argv);
