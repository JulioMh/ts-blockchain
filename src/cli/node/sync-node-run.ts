#!/usr/bin/env node

import { program } from 'commander';
import Node, { PeerNode } from '../../web/Node';

program
    .option('-p, --port <port>', 'Node port to be used, default to 8080')
    .option('-b, --bootstrap <bootstrap>', 'Bootstrap node. Format: <ip>:<port>')
    .option('-k, --known-peer <knownPeer>', 'Known Peer. Format: <ip>:<port>')

program.parse(process.argv);

const { port = 8080, bootstrap, knownPeer } = program.opts();

const node = new Node(port);
if(bootstrap) {
    const [bootstrapIp, bootstrapPort] = bootstrap.split(':');
    node.newPeerNode(
        new PeerNode(
            bootstrapIp,
            bootstrapPort,
            true,
            true)
    )
}
if(knownPeer) {
    const [knownPeerIp, knownPeerPort] = knownPeer.split(':');
    node.newPeerNode(
        new PeerNode(
            knownPeerIp,
            knownPeerPort,
            false,
            true)
    )
}

node.start()