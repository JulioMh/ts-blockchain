"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashBlock = exports.saveNewBlock = exports.loadBlockHistory = exports.loadGenesisBalances = void 0;
const fs_1 = require("fs");
const crypto_1 = __importDefault(require("crypto"));
const path_1 = __importDefault(require("path"));
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
const loadBlockHistory = () => {
    if (!(0, fs_1.existsSync)(pathToBlockHistory)) {
        return [];
    }
    return readFile(pathToBlockHistory);
};
exports.loadBlockHistory = loadBlockHistory;
const saveNewBlock = (block) => {
    const blocks = (0, exports.loadBlockHistory)();
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