#!/usr/bin/env node

import { program } from 'commander'
import Node from '../../node/Node'

program.action(() => {
  const node = Node.getNode(8080)
  node.start()
})
program.parse(process.argv)