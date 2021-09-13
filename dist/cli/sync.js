#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
commander_1.program
    .version('0.0.1')
    .description('CLI to interact with centralized sync blockchain')
    .command('tx', 'Interact with transactions (add, ...)')
    .command('balances', 'Interact with balances (list, ...)')
    .action(() => {
    commander_1.program.help();
})
    .parse(process.argv);
//# sourceMappingURL=sync.js.map