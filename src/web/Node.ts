import axios from 'axios';
import express, { Express, Request, Response } from 'express';
import { stat } from 'fs';
import { Server } from 'http';

import { Hash } from '../model/Block';
import State from '../model/State';
import { mapDTOToStatusRes } from './dto/Status';
import { getBlanaces, getStatus, handleErrors, postTx, postStop } from './routes';

export class PeerNode {
  ip: string;
  port: number;
  isBootstrap: boolean;
  isActive: boolean;
  constructor(ip: string, port: number, isBootstrap: boolean, isActive: boolean) {
    this.ip = ip;
    this.port = port;
    this.isActive = isActive;
    this.isBootstrap = isBootstrap
  }

  getTCPAddress() {
    return `${this.ip}:${this.port}`
  }
};

export type StatusRes = {
  blockHash: Hash;
  blockNumber: number;
  peersKnown: PeerNodeMap;
};

export type PeerNodeMap = {
  [key: string]: PeerNode
}

export default class Node {
  private app: Express;

  private port: number;

  private server: Server | undefined;

  private state: State | undefined;

  private knownPeers: PeerNodeMap;

  constructor(port: number) {
    this.port = port;
    this.app = express();
    this.knownPeers = {};

    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use((req, res, next) => {
      console.log(`${req.method} -> ${req.url}`);
      next();
    });
  }

  newPeerNode(peer: PeerNode): Node {
    this.knownPeers = {
      ...this.knownPeers,
      [peer.getTCPAddress()]: peer,
    };
    return this;
  }

  getPort() {
    return this.port;
  }

  async fetchNewBlocksAndPeers() {
    if(!this.state) throw new Error('Node must be running');

    const knownAddresses = Object.keys(this.knownPeers)
    for(const address of knownAddresses) {
      const response = await axios.get(`${address}/status`)
      const peerStatus = mapDTOToStatusRes(response.data)
      if(this.state.getLatestBlockNumber() < peerStatus.blockNumber) {
        const newBlockCount = peerStatus.blockNumber - this.state.getLatestBlockNumber();
      }
      Object.keys(peerStatus.peersKnown).forEach(address => {
        if(!knownAddresses.includes(address)){
          this.newPeerNode(peerStatus.peersKnown[address])
        }
      })
    }  
  }

  start() {
    this.state = State.newStateFromDisk();
    this.server = this.app.listen(this.port, () => {
      console.log(`New node for sync-blockchain running on http://localhost:${this.port}`);
    });

    this.app.get('/balances', getBlanaces(this.state));
    this.app.post('/tx', postTx(this.state));
    this.app.get('/status', getStatus(this.state, this.knownPeers));
    this.app.post('/stop', postStop(this.stop));
    this.app.use(handleErrors);
  }

  stop() {
    this.server?.close(() => {
      console.log(`Closing node running on http://localhost:${this.port}`);
    });
  }
}
