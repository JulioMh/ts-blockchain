#!/usr/bin/env node

import { program } from 'commander';
import Node, { PeerNode } from '../../web/Node';

program.option('-p, --port <port>', 'Node port to be used, default to 8080');

program.parse(process.argv);

const { port = 8080 } = program.opts();
if(port != 8080) {
    new Node(port)
        .newPeerNode(new PeerNode(
            "localhost",
            8080,
            true,
            true))
        .start()
} else {
    new Node(port).start()
}

