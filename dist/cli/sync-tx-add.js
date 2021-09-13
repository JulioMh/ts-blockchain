#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const Tx_1 = __importDefault(require("../model/Tx"));
const State_1 = __importDefault(require("../model/State"));
const process_1 = require("process");
commander_1.program
    .option('-f, --from <from>', 'Sender name')
    .option('-t, --to <to>', 'Beneficiary name')
    .option('-v, --value <value>', 'Transfer ammount')
    .parse(process.argv);
const { from, to, value } = commander_1.program.opts();
if (!from || !to || !value) {
    console.log('You must type a sender, beneficiary and amount');
    console.log('');
    commander_1.program.outputHelp();
    (0, process_1.exit)(1);
}
const state = State_1.default.newStateFromDisk();
const tx = new Tx_1.default(from, to, parseFloat(value));
state.addTx(tx);
state.persist();
//# sourceMappingURL=sync-tx-add.js.map