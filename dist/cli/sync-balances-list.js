#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const State_1 = __importDefault(require("../model/State"));
commander_1.program.action(() => {
    const state = State_1.default.newStateFromDisk();
    console.log(`Accounts balances at ${state.snapshot.substring(0, 12)}...`);
    console.log('------------------');
    Object.keys(state.balances).forEach(account => console.log(`${account}: ${state.balances[account]}`));
});
commander_1.program.parse(process.argv);
//# sourceMappingURL=sync-balances-list.js.map