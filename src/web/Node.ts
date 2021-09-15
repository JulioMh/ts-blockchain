import express, { Express, Request, Response } from 'express';
import { Server } from 'http';
import { Hash } from '../model/Block';
import State from '../model/State'
import { getBlanaces, getStatus, handleErrors, postTx } from './endpoints';

export type PeerNode = {
  ip: string,
  port: number,
  isBootstrap: boolean,
  isActive: boolean
}

export type StatusRes = {
  blockHash: Hash,
  blockNumber: number,
  peersKnown: PeerNode[] 
}

export default class NodeList {
  private static nodeList: NodeList;
  private nodes: Node[]

  private constructor(){
    this.nodes = []
  }

  availableNodes(): number[] {
    return this.nodes.map(node => node.getPort())
  }

  getNode(port: number): Node {    
    if(!port) 
      throw new Error('Port is missing')

    const existingNode = this.nodes.find(node => node.getPort() === port);
    
    if(existingNode) 
      return existingNode
    
    const newNode = new Node(port)
    this.nodes = [...this.nodes, newNode]

    return newNode
  }

  static getNodeList(){
    if(!NodeList.nodeList) NodeList.nodeList = new NodeList()

    return NodeList.nodeList
  }
}

export class Node {
  private app: Express
  private port: number
  private server: Server | undefined
  private state: State | undefined;
  private knownPeers: PeerNode[]

  constructor(port: number){
    this.port = port;
    this.app = express()
    this.knownPeers = []

    this.app.use(express.urlencoded({extended: true}));
    this.app.use(express.json());
    this.app.use((req,res,next)=>{
      console.log(`${req.method} -> ${req.url}`)
      next()
    })
  }

  newPeerNode(ip: string, port: number) {
    this.knownPeers = [...this.knownPeers, {
      ip,
      port,
      isBootstrap: true,
      isActive: true
    }]
  }

  getPort(){
    return this.port;
  }
  
  start(){
    this.state = State.newStateFromDisk();
    this.server = this.app.listen(this.port, () => {
      console.log(`New node for sync-blockchain running on http://localhost:${this.port}`)
    })

    this.app.get('/balances', getBlanaces(this.state))
    this.app.post('/tx', postTx(this.state))
    this.app.get('/status', getStatus(this.state, this.knownPeers))
    this.app.use(handleErrors)
  }

  stop(){
    this.server?.close(() => {
      console.log(`Closing node running on http://localhost:${this.port}`)
    })
  }
}