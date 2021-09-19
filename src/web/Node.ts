import axios from 'axios';
import express, { Express, Request, Response, NextFunction } from 'express';
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
    if(!ip || !port) throw new Error('IP and PORT are required')
    this.ip = ip;
    this.port = port;
    this.isActive = isActive;
    this.isBootstrap = isBootstrap
  }

  setIsActive(isActive: boolean) {
    this.isActive = isActive
  }

  getTCPAddress() {
    return `${this.ip}:${this.port}`
  }
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
    this.app.use((req: Request, res: Response, next: NextFunction) => {
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

  getPort(): number {
    return this.port;
  }

  getKnownPeers(): PeerNodeMap {
    return this.knownPeers
  }

  getState(): State | undefined {
    return this.state
  }

  async fetchNewBlocksAndPeers() {
    if(!this.state) throw new Error('Node must be running');
    console.log('Looking for new Peers...')
    const knownAddresses = Object.keys(this.knownPeers)
    for(const address of knownAddresses) {
      if(!this.knownPeers[address].isActive) return
      const response = await axios.get(`http://${address}/status`)
        .catch(err => {
          if(err.code === 'ECONNREFUSED') {
            this.knownPeers[address].setIsActive(false)
          }
        })
      if(!response) return
      const peerStatus = mapDTOToStatusRes(response.data)
      if(this.state.getLatestBlockNumber() < peerStatus.blockNumber) {
        console.log('New blocks discovered')
        const newBlockCount = peerStatus.blockNumber - this.state.getLatestBlockNumber();
        console.log(`Count: ${newBlockCount}`)
      }
      Object.keys(peerStatus.peersKnown).forEach(address => {
        if(!knownAddresses.includes(address)){
          console.log(`Found new Peer ${address}`)
          this.newPeerNode(peerStatus.peersKnown[address])
        }
      })
    }  
  }

  start() {
    this.state = State.newStateFromDisk();

    this.app.get('/statusv2', (req, res) => {console.log(this.knownPeers); res.send(this.knownPeers)})
    this.app.get('/balances', getBlanaces(this.state));
    this.app.post('/tx', postTx(this.state));
    this.app.get('/status', getStatus(this));
    this.app.post('/stop', postStop(this.stop));
    this.app.use(handleErrors);

    setInterval(this.fetchNewBlocksAndPeers.bind(this), 5000)

    this.server = this.app.listen(this.port, () => {
      console.log(`New node for sync-blockchain running on http://localhost:${this.port}`);
    });
  }

  stop() {
    this.server?.close(() => {
      console.log(`Closing node running on http://localhost:${this.port}`);
    });
  }
}
