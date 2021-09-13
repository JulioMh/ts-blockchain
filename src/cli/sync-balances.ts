#!/usr/bin/env node

import { program } from 'commander'

program
  .command('list', 'List balances')
program.action(() => {
    program.help()
})
program.parse(process.argv)