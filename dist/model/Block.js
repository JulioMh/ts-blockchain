"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
class Block {
    constructor(parentHash, number, time, txPool) {
        this.blockHeader = {
            parentHash,
            number,
            time
        };
        this.txPool = txPool;
    }
    hash() {
        const hashSum = crypto_1.default.createHash('sha256');
        hashSum.update(JSON.stringify(this));
        return hashSum.digest('hex');
    }
    getParentHash() {
        return this.blockHeader.parentHash;
    }
    getBlockNumber() {
        return this.blockHeader.number;
    }
    toBlockFs() {
        return {
            hash: this.hash(),
            block: {
                header: {
                    parent: this.blockHeader.parentHash,
                    number: this.blockHeader.number,
                    time: this.blockHeader.time
                },
                payload: this.txPool
            }
        };
    }
    static fromBlockFs(blockFs) {
        return new Block(blockFs.block.header.parent, blockFs.block.header.number, blockFs.block.header.time, blockFs.block.payload);
    }
}
exports.default = Block;
//# sourceMappingURL=Block.js.map