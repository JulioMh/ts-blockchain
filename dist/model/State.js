"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../utils/db");
const Block_1 = __importDefault(require("./Block"));
class State {
    constructor() {
        this.balances = {};
        this.txMempool = [];
        this.latestBlockHash = '';
    }
    addTx(tx) {
        this.apply(tx);
        this.txMempool = [...this.txMempool, tx];
    }
    addBlock(block) {
        block.txPool.forEach(tx => this.addTx(tx));
    }
    persist() {
        const block = new Block_1.default(this.latestBlockHash, new Date().valueOf(), this.txMempool);
        const newHash = block.hash();
        (0, db_1.saveNewBlock)(block.toBlockFs());
        this.latestBlockHash = newHash;
    }
    static newStateFromDisk() {
        const state = new State();
        const genesisBalances = (0, db_1.loadGenesisBalances)();
        Object.keys(genesisBalances).forEach(account => state.balances[account] = genesisBalances[account]);
        const blockHistory = (0, db_1.loadBlockHistory)();
        blockHistory.forEach(block => state.applyBlock(block));
        state.latestBlockHash = blockHistory.length ?
            blockHistory[blockHistory.length - 1].hash
            : String(0).padStart(64, '0');
        return state;
    }
    applyBlock(block) {
        block.block.payload.forEach(tx => this.apply(tx));
    }
    apply(tx) {
        const fromBalance = this.balances[tx.from];
        const toBalance = this.balances[tx.to];
        if (!fromBalance || fromBalance < tx.value) {
            throw new Error(`${tx.from} doesn't have enough balance`);
        }
        this.balances[tx.from] -= tx.value;
        this.balances[tx.to] = toBalance ? toBalance + tx.value : tx.value;
    }
}
exports.default = State;
//# sourceMappingURL=State.js.map