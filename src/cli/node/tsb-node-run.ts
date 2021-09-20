#!/usr/bin/env node

import { program } from 'commander';
import Node, { PeerNode } from '../../web/Node';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

program
    .option('-d, --data-dir <databasePath>', 'Path to database folder')
    .option('-p, --port <port>', 'Node port to be used, default to 8080')
    .option('-b, --bootstrap <bootstrap>', 'Bootstrap node. Format: <ip>:<port>')
    .option('-k, --known-peer <knownPeer>', 'Known Peer. Format: <ip>:<port>')

program.parse(process.argv);

const { port = 8080, databasePath = '../../database', bootstrap, knownPeer } = program.opts();
console.log(databasePath)
console.log(__dirname)
const resolvedDatabasePath = path.resolve(__dirname, databasePath);
if(!existsSync(resolvedDatabasePath)){
    mkdirSync(resolvedDatabasePath)
}

const node = new Node(port, resolvedDatabasePath);
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