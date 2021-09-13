import express, { Express } from 'express';
import { Server } from 'http';
import State from '../model/State'
import Tx from '../model/Tx';

export default class Node {
  private static node: Node
  private app: Express
  private port: number
  private server: Server | undefined

  private constructor(port: number){
    this.port = port;
    this.app = express()

    this.app.use(express.urlencoded({extended: true}));
    this.app.use(express.json());


    this.app.get('/balances', (req, res, next) => {
      const state = State.newStateFromDisk();
      res.send(state.balances)
      next()
    })

    this.app.post('/tx', (req, res, next) => {
      console.log(req.body)
      const { from, to, value } = req.body;

      const state = State.newStateFromDisk();
      
      state.addTx(new Tx(from, to, value))

      res.sendStatus(200)
      next()
    })
  }
  
  start(){
    this.server = this.app.listen(this.port, () => {
      console.log(`New node for sync-blockchain running on http://localhost:${this.port}`)
    })    
  }

  stop(){
    this.server?.close(() => {
      console.log(`Closing node running on http://localhost:${this.port}`)
    })
  }

  static getNode(port: number | undefined): Node{
    if(Node.node) {
      return Node.node
    }
    if(!port) {
      throw new Error('Port argument is missing')
    }
    return new Node(port)
  }
}