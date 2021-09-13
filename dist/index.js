#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const Tx_1 = __importDefault(require("./model/Tx"));
const State_1 = __importDefault(require("./model/State"));
const program = new commander_1.Command();
const state = State_1.default.newStateFromDisk();
console.log(state);
program
    .version('0.0.1')
    .description('CLI to interact with centralized sync blockchain')
    .option('--tx <from> <to> <value>', 'Add new Tx')
    .command('tx <from> <to> <value>')
    .description('Add a new transaction')
    .action((from, to, value) => {
    console.log(from);
    console.log(to);
    console.log(value);
    const tx = new Tx_1.default(from, to, value);
    state.add(tx);
})
    .option('-b, --balances', 'List balances')
    .parse(process.argv);
console.log(program.opts());
const { tx, balances } = program.opts();
if (!tx && !balances) {
    program.outputHelp();
}
//# sourceMappingURL=index.js.map