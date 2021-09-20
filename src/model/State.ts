import { loadBlockHistory, loadGenesisBalances, saveNewBlock } from '../utils/db';
import { Balances } from './Account';
import Block, { Hash } from './Block';
import { GENESIS_HASH } from './Genesis';
import Tx from './Tx';

export default class State {
  balances: Balances;

  txMempool: Tx[];

  latestBlockHash!: Hash;

  latestBlock: Block | undefined;

  private constructor() {
    this.balances = {};
    this.txMempool = [];
  }

  addBlocks(blocks: Block[]) {
    blocks.forEach(block => this.addBlock(block))
  }

  addBlock(block: Block) {
    this.applyBlock(block);

    const newHash = block.hash();

    saveNewBlock(block.toBlockFs());
    this.latestBlockHash = newHash;
    this.latestBlock = block;
  }

  getLatestBlock(): Block | undefined {
    return this.latestBlock;
  }

  getLatestBlockHash(): Hash {
    return this.latestBlockHash;
  }

  getLatestBlockNumber(): number {
    return this.latestBlock?.getBlockNumber() || 0;
  }

  nextBlockNumber() {
    return this.getLatestBlockNumber() + 1;
  }

  static newStateFromDisk(): State {
    const state = new State();
    const genesisBalances = loadGenesisBalances();
    Object.keys(genesisBalances).forEach(
      (account) => (state.balances[account] = genesisBalances[account])
    );

    if (!state.latestBlockHash) state.latestBlockHash = GENESIS_HASH;
    
    const blockHistory = loadBlockHistory();
    blockHistory.forEach((blockFs) => {
      const block = Block.fromBlockFs(blockFs);
      state.applyBlock(block);
      state.latestBlockHash = blockFs.hash;
      state.latestBlock = block;
    });

    return state;
  }

  private applyBlock(block: Block) {
    if (block.getBlockNumber() !== this.nextBlockNumber())
      throw new Error(
        `Next expected block number should be ${this.nextBlockNumber()} not ${block.getBlockNumber()}`
      );
    if (block.getParentHash() !== this.getLatestBlockHash()) {
      throw new Error(
        `Next block parent hash must be ${this.getLatestBlockHash()} not ${block.getParentHash()}`
      );
    }

    block.txPool.forEach((tx) => this.applyTx(tx));
  }

  private applyTx(tx: Tx) {
    const fromBalance = this.balances[tx.from];
    const toBalance = this.balances[tx.to];
    if (!fromBalance || fromBalance < tx.value) {
      throw new Error(`${tx.from} doesn't have enough balance`);
    }

    this.balances[tx.from] -= tx.value;
    this.balances[tx.to] = toBalance ? toBalance + tx.value : tx.value;
  }
}
