import { loadGenesisBalances, loadBlockHistory, saveNewBlock } from '../utils/db'
import { Balances } from './Account'
import Block, { Hash, BlockFs } from './Block';
import Tx from './Tx'

export default class State {
  balances: Balances;
  txMempool: Tx[];
  latestBlockHash: Hash;

  private constructor() {
    this.balances = {};
    this.txMempool = [];
    this.latestBlockHash = '';
  }

  addTx(tx: Tx) {
    this.apply(tx)
    this.txMempool = [...this.txMempool, tx]
  }

  addBlock(block: Block) {
    block.txPool.forEach(tx => this.addTx(tx))
  }

  persist(){
    const block = new Block(this.latestBlockHash, new Date().valueOf(), this.txMempool);
    const newHash = block.hash();
    saveNewBlock(block.toBlockFs());
    this.latestBlockHash = newHash;
  }

  static newStateFromDisk(): State {
    const state = new State();
    const genesisBalances = loadGenesisBalances();
    Object.keys(genesisBalances).forEach(account => state.balances[account] = genesisBalances[account])

    const blockHistory = loadBlockHistory()
    blockHistory.forEach(block => state.applyBlock(block))

    state.latestBlockHash = blockHistory.length ? 
      blockHistory[blockHistory.length - 1].hash
      : String(0).padStart(64, '0');

    return state
  }

  private applyBlock(block: BlockFs) {
    block.block.payload.forEach(tx => this.apply(tx))
  }

  private apply(tx: Tx) {
    const fromBalance = this.balances[tx.from]
    const toBalance = this.balances[tx.to]
    if(!fromBalance || fromBalance < tx.value) {
      throw new Error(`${tx.from} doesn't have enough balance`)
    }

    this.balances[tx.from] -= tx.value
    this.balances[tx.to] = toBalance ? toBalance + tx.value : tx.value
  }
}
