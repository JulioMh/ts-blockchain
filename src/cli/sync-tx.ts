#!/usr/bin/env node

import { program } from 'commander'

program
  .command('add', 'Add a new transcation')
program.action(() => {
  program.help()
})
program.parse(process.argv)