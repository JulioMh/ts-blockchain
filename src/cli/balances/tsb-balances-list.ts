#!/usr/bin/env node

import { program } from 'commander';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

import State from '../../model/State';

program
  .option('-d, --data-dir <databasePath>', 'Path to database folder')

const { databasePath = '../../database' } = program.opts();

const resolvedDatabasePath = path.resolve(__dirname, databasePath);
if(!existsSync(resolvedDatabasePath)){
    mkdirSync(resolvedDatabasePath)
}

const state: State = State.newStateFromDisk(resolvedDatabasePath);
console.log(`Accounts balances at ${state.latestBlockHash.substring(0, 12)}...`);
console.log('------------------');
Object.keys(state.balances).forEach((account) =>
  console.log(`${account}: ${state.balances[account]}`)
);

program.parse(process.argv);
