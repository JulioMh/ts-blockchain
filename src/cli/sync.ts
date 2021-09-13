#!/usr/bin/env node

import { program } from 'commander';

program
  .version('0.0.1')
  .description('CLI to interact with centralized sync blockchain')
  .command('tx', 'Interact with transactions (add, ...)')
  .command('balances', 'Interact with balances (list, ...)')
  .action(() => {
    program.help()
  })
  .parse(process.argv)