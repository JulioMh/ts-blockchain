import { loadGenesisBalances, loadTxHistory, saveNewBlock } from '../utils/db'
import { Balances } from './Account'
import Block, { Hash } from './Block';
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

  add(tx: Tx) {
    this.applyTx(tx)
    this.txMempool = [...this.txMempool, tx]
  }

  persist(){
    const block = new Block(this.latestBlockHash, (new Date()).valueOf(), this.txMempool);
    const newHash = block.hash();
    saveNewBlock(block);
    this.latestBlockHash = newHash;
  }

  static newStateFromDisk(): State {
    const state = new State();
    const genesisBalances = loadGenesisBalances();
    Object.keys(genesisBalances).forEach(account => state.balances[account] = genesisBalances[account])

    const txHistory = loadTxHistory()
    txHistory.forEach(tx => state.applyTx(tx))

    state.hash = hashTxHistory();

    return state
  }

  private applyTx(tx: Tx) {
    const fromBalance = this.balances[tx.from]
    const toBalance = this.balances[tx.to]
    if(!fromBalance || fromBalance <= tx.value) {
      throw new Error(`${tx.from} doesn't have enough balance`)
    }

    this.balances[tx.from] -= tx.value
    this.balances[tx.to] = toBalance ? toBalance + tx.value : tx.value
  }
}
