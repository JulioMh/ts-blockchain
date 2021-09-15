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
    }
    addBlock(block) {
        this.applyBlock(block);
        const newHash = block.hash();
        (0, db_1.saveNewBlock)(block.toBlockFs());
        this.latestBlockHash = newHash;
        this.latestBlock = block;
    }
    getLatestBlock() {
        return this.latestBlock;
    }
    getLatestBlockHash() {
        return this.latestBlockHash;
    }
    getLatestBlockNumber() {
        var _a;
        return ((_a = this.latestBlock) === null || _a === void 0 ? void 0 : _a.getBlockNumber()) || 0;
    }
    nextBlockNumber() {
        var _a;
        return this.latestBlock ? (_a = this.latestBlock) === null || _a === void 0 ? void 0 : _a.getBlockNumber() : 0;
    }
    static newStateFromDisk() {
        const state = new State();
        const genesisBalances = (0, db_1.loadGenesisBalances)();
        Object.keys(genesisBalances).forEach(account => state.balances[account] = genesisBalances[account]);
        const blockHistory = (0, db_1.loadBlockHistory)();
        blockHistory.forEach(blockFs => {
            let block = Block_1.default.fromBlockFs(blockFs);
            state.applyBlock(block);
            state.latestBlockHash = blockFs.hash;
            state.latestBlock = block;
        });
        if (!state.latestBlockHash)
            state.latestBlockHash = String(0).padStart(64, '0');
        return state;
    }
    applyBlock(block) {
        if (block.getBlockNumber() !== this.nextBlockNumber())
            throw new Error(`Next expected block number should be ${this.nextBlockNumber()} not ${block.getBlockNumber()}`);
        if (block.getParentHash() !== this.getLatestBlockHash()) {
            throw new Error(`Next block parent hash must be ${this.getLatestBlockHash()} not ${block.getParentHash()}`);
        }
        block.txPool.forEach(tx => this.applyTx(tx));
    }
    applyTx(tx) {
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