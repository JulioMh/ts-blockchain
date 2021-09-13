#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const Node_1 = __importDefault(require("../../node/Node"));
commander_1.program.action(() => {
    const node = Node_1.default.getNode(8080);
    node.start();
});
commander_1.program.parse(process.argv);
//# sourceMappingURL=sync-run.js.map