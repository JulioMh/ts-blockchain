"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const State_1 = __importDefault(require("../model/State"));
const Block_1 = __importDefault(require("../model/Block"));
const Tx_1 = __importDefault(require("../model/Tx"));
const state = State_1.default.newStateFromDisk();
const block0 = new Block_1.default(String(0).padStart(32, '0'), new Date().valueOf(), [
    new Tx_1.default('andrej', 'julio', 1000),
    new Tx_1.default('julio', 'juan', 500)
]);
state.addBlock(block0);
state.persist();
//# sourceMappingURL=migrateToBlock.js.map