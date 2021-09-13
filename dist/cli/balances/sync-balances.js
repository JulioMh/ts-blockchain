#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const path_1 = __importDefault(require("path"));
const pathToList = path_1.default.resolve(__dirname, './sync-balances-list.js');
commander_1.program
    .command('list', 'List balances', { executableFile: pathToList });
commander_1.program.action(() => {
    commander_1.program.help();
});
commander_1.program.parse(process.argv);
//# sourceMappingURL=sync-balances.js.map