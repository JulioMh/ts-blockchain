#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
commander_1.program
    .command('list', 'List balances');
commander_1.program.action(() => {
    commander_1.program.help();
});
commander_1.program.parse(process.argv);
//# sourceMappingURL=sync-balances.js.map