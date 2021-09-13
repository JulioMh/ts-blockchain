"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
class Block {
    constructor(parentHash, time, txPool) {
        this.blockHeader = {
            parentHash,
            time
        };
        this.txPool = txPool;
    }
    hash() {
        const hashSum = crypto_1.default.createHash('sha256');
        hashSum.update(JSON.stringify(this));
        return hashSum.digest('hex');
    }
    toBlockFs() {
        return {
            hash: this.hash(),
            block: {
                header: {
                    parent: this.blockHeader.parentHash,
                    time: this.blockHeader.time
                },
                payload: this.txPool
            }
        };
    }
}
exports.default = Block;
//# sourceMappingURL=Block.js.map