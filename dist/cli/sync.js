#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const path_1 = __importDefault(require("path"));
const pathToTx = path_1.default.resolve(__dirname, './tx/sync-tx.js');
const pathToBalances = path_1.default.resolve(__dirname, './balance/sync-balances.js');
const pathToRun = path_1.default.resolve(__dirname, './node/sync-run.js');
commander_1.program
    .version('0.0.1')
    .description('CLI to interact with centralized sync blockchain')
    .command('tx', 'Interact with transactions (add, ...)', { executableFile: pathToTx })
    .command('balances', 'Interact with balances (list, ...)', { executableFile: pathToBalances })
    .command('run', 'Run a new sync-blockchain node', { executableFile: pathToRun })
    .action(() => {
    commander_1.program.help();
})
    .parse(process.argv);
//# sourceMappingURL=sync.js.map