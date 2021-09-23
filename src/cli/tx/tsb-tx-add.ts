#!/usr/bin/env node

import { program } from 'commander';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import { exit } from 'process';

import Block from '../../model/Block';
import State from '../../model/State';
import Tx from '../../model/Tx';

program
  .option('-d, --data-dir <dataDir>', 'Path to database folder')
  .option('-f, --from <from>', 'Sender name')
  .option('-t, --to <to>', 'Beneficiary name')
  .option('-v, --value <value>', 'Transfer ammount')
  .parse(process.argv);

const { dataDir = '../../database', from, to, value } = program.opts();

const resolvedDatabasePath = path.resolve(process.cwd(), dataDir);

if (!from || !to || !value) {
  console.log('You must type a sender, beneficiary and amount');
  console.log('');
  program.outputHelp();
  exit(1);
}

const state = State.newStateFromDisk(resolvedDatabasePath);
const tx = new Tx(from, to, parseFloat(value));

const block = new Block(
  state.getLatestBlockHash(),
  state.nextBlockNumber(),
  new Date().valueOf(),
  [tx]
);
state.addBlock(block);
