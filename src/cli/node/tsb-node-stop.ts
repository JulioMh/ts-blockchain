#!/usr/bin/env node

import { program } from 'commander';
import axios from 'axios' 
import { exit } from 'process';

program.option('-p, --port <port>', 'Node port to be used').parse(process.argv);

const { port } = program.opts();


if (!port) {
  console.log('You must select a port');

  program.outputHelp();
  exit(1);
}

axios.post(`http://localhost:${port}/stop`)
  .then(response => console.log(response.status))
  .catch(err => console.log(err))