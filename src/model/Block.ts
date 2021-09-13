import Tx from "./Tx";
import crypto from 'crypto';

export type Hash = string;

export type BlockHeader = {
  parentHash: string,
  time: number
}

export type BlockFs = {
  hash: string,
  block: {
    header: {
      parent: string,
      time: number
    },
    payload: Tx[]
  }
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
    const hashSum = crypto.createHash('sha256');
    hashSum.update(JSON.stringify(this))
  
    return hashSum.digest('hex')
  }

  toBlockFs(): BlockFs{
    return {
      hash: this.hash(),
      block: {
        header: {
          parent: this.blockHeader.parentHash,
          time: this.blockHeader.time
        },
        payload: this.txPool
      }
    }
  }
}