#!/usr/bin/env node

import { program } from 'commander';
import Tx from '../model/Tx';
import State from '../model/State';
import { exit } from 'process';

program
  .option('-f, --from <from>', 'Sender name')
  .option('-t, --to <to>', 'Beneficiary name')
  .option('-v, --value <value>', 'Transfer ammount')
  .parse(process.argv)

const { from, to, value } = program.opts();
if(!from || !to || !value) {
  console.log('You must type a sender, beneficiary and amount');
  console.log('');
  program.outputHelp();
  exit(1);
}

const state = State.newStateFromDisk();
const tx = new Tx(from, to, parseFloat(value));
state.add(tx);
state.persist();
