import Tx from "./Tx"
import { hashBlock } from '../utils/db'

export type Hash = string;

export type BlockHeader = {
  parentHash: string,
  time: number
}

export default class Block {
  blockHeader: BlockHeader;
  txPool: Tx[];

  constructor(parentHash: Hash, time: number, txPool: Tx[]){
    this.blockHeader = {
      parentHash,
      time
    }
    this.txPool = txPool;
  }

  hash(): Hash {
    return hashBlock(this)
  }
}