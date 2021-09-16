#!/usr/bin/env node

import { program } from 'commander';
import Node, { PeerNode } from '../../web/Node';

program.option('-p, --port', 'Node port to be used, default to 8080');

program.parse(process.argv);

const { port = 8080 } = program.opts();
const knownPeers: PeerNode[] = port != 8080 ? [{
    ip: "localhost",
    isActive: true,
    isBootstrap: true,
    port: 8080
}] : []

new Node(port, knownPeers).start()
