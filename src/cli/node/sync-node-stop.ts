#!/usr/bin/env node

import { program } from 'commander'
import { exit } from 'process'
import NodeList from '../../web/Node'

program
  .option('-p, --port <port>', 'Node port to be used, default to 8080')
  .parse(process.argv)

const { port } = program.opts();

const nodeList = NodeList.getNodeList();

if(!port) {
  console.log('You must select a port')
  
  console.log('Available ports: ')
  console.log(nodeList.availableNodes())
  
  program.outputHelp()
  exit(1)
}

nodeList.getNode(port).stop()