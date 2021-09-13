#!/usr/bin/env node

import { program } from 'commander'
import State from '../model/State'

program.action(() => {
  const state: State = State.newStateFromDisk();
  console.log(`Accounts balances at ${state.snapshot.substring(0, 12)}...`)
  console.log('------------------')
  Object.keys(state.balances).forEach(account => 
    console.log(`${account}: ${state.balances[account]}`)
  )
})
program.parse(process.argv)