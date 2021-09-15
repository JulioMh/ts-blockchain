import Tx from "./Tx";
import crypto from 'crypto';

export type Hash = string;

export type BlockHeader = {
  parentHash: string,
  number: number,
  time: number
}

export type BlockFs = {
  hash: string,
  block: {
    header: {
      parent: string,
      number: number,
      time: number
    },
    payload: Tx[]
  }
}

export default class Block {
  blockHeader: BlockHeader;
  txPool: Tx[];

  constructor(parentHash: Hash, number: number, time: number, txPool: Tx[]){
    this.blockHeader = {
      parentHash,
      number,
      time
    }
    this.txPool = txPool;
  }

  hash(): Hash {
    const hashSum = crypto.createHash('sha256');
    hashSum.update(JSON.stringify(this))
  
    return hashSum.digest('hex')
  }

  getParentHash(): Hash {
    return this.blockHeader.parentHash
  }

  getBlockNumber(): number {
    return this.blockHeader.number
  }

  toBlockFs(): BlockFs{
    return {
      hash: this.hash(),
      block: {
        header: {
          parent: this.blockHeader.parentHash,
          number: this.blockHeader.number,
          time: this.blockHeader.time
        },
        payload: this.txPool
      }
    }
  }

  static fromBlockFs(blockFs: BlockFs): Block {
    return new Block(blockFs.block.header.parent, blockFs.block.header.number, blockFs.block.header.time, blockFs.block.payload)
  }
}