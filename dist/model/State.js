"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../utils/db");
class State {
    constructor() {
        this.balances = {};
        this.txMempool = [];
        this.snapshot = '';
    }
    add(tx) {
        this.applyTx(tx);
        this.txMempool = [...this.txMempool, tx];
    }
    persist() {
        const newTxHistory = [...this.txMempool, ...(0, db_1.loadTxHistory)()];
        (0, db_1.saveTxHistory)(newTxHistory);
        this.snapshot = (0, db_1.hashTxHistory)();
    }
    static newStateFromDisk() {
        const state = new State();
        const genesisBalances = (0, db_1.loadGenesisBalances)();
        Object.keys(genesisBalances).forEach(account => state.balances[account] = genesisBalances[account]);
        const txHistory = (0, db_1.loadTxHistory)();
        txHistory.forEach(tx => state.applyTx(tx));
        state.snapshot = (0, db_1.hashTxHistory)();
        return state;
    }
    applyTx(tx) {
        const fromBalance = this.balances[tx.from];
        const toBalance = this.balances[tx.to];
        if (!fromBalance || fromBalance <= tx.value) {
            throw new Error(`${tx.from} doesn't have enough balance`);
        }
        this.balances[tx.from] -= tx.value;
        this.balances[tx.to] = toBalance ? toBalance + tx.value : tx.value;
    }
}
exports.default = State;
//# sourceMappingURL=State.js.map