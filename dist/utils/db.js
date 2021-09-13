"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashBlock = exports.saveNewBlock = exports.saveTxHistory = exports.loadBlockHistory = exports.loadTxHistory = exports.loadGenesisBalances = void 0;
const fs_1 = require("fs");
const crypto_1 = __importDefault(require("crypto"));
const Tx_1 = __importDefault(require("../model/Tx"));
const path_1 = __importDefault(require("path"));
const pathToTxHistory = path_1.default.resolve(__dirname, '../database/tx.json');
const pathToGenesis = path_1.default.resolve(__dirname, '../database/genesis.json');
const pathToBlockHistory = path_1.default.resolve(__dirname, '../database/block.json');
const readFile = (path) => {
    return JSON.parse((0, fs_1.readFileSync)(path, { encoding: 'utf8' }));
};
const loadGenesisBalances = () => {
    const genesis = readFile(pathToGenesis);
    return genesis.balances;
};
exports.loadGenesisBalances = loadGenesisBalances;
const loadTxHistory = () => {
    const rawTxs = readFile(pathToTxHistory);
    return rawTxs.map((rawTx) => new Tx_1.default(rawTx.from, rawTx.to, rawTx.value));
};
exports.loadTxHistory = loadTxHistory;
const loadBlockHistory = () => {
    return readFile(pathToBlockHistory);
};
exports.loadBlockHistory = loadBlockHistory;
const saveTxHistory = (txHistory) => {
    (0, fs_1.writeFileSync)(pathToTxHistory, JSON.stringify(txHistory, null, 2));
};
exports.saveTxHistory = saveTxHistory;
const saveNewBlock = (block) => {
    const blocks = readFile(pathToBlockHistory);
    (0, fs_1.writeFileSync)(pathToBlockHistory, JSON.stringify([...blocks, block], null, 2));
};
exports.saveNewBlock = saveNewBlock;
const hashBlock = (block) => {
    const hashSum = crypto_1.default.createHash('sha256');
    hashSum.update(JSON.stringify(block));
    return hashSum.digest('hex');
};
exports.hashBlock = hashBlock;
//# sourceMappingURL=db.js.map