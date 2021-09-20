import { existsSync, readFileSync, writeFileSync } from "fs";
import Block, { BlockFs } from "../model/Block";
import { GENESIS_FILE } from "../model/Genesis";

export default class Database {
    genesisPath: string;
    blockHistoryPath: string;

    constructor(databasePath: string) {
        this.genesisPath = `${databasePath}/genesis.json`;
        this.blockHistoryPath = `${databasePath}/blocks.json`;
    }

    private readFile(path: string) {
        return JSON.parse(readFileSync(path, { encoding: 'utf8' }))
    }

    loadGenesisBalances() {
        if (!existsSync(this.genesisPath)) {
            writeFileSync(`${this.genesisPath}/genesis.json`, JSON.stringify(GENESIS_FILE, null, 2))
            return GENESIS_FILE;
        }
        return this.readFile(this.genesisPath).balances
    }

    loadBlockHistory(): BlockFs[] {
        if (!existsSync(this.blockHistoryPath)) {
            return [];
        }
        return this.readFile(this.blockHistoryPath);
    }

    saveNewBlock(block: BlockFs) {
        const blocks = this.loadBlockHistory();
        writeFileSync(this.blockHistoryPath, JSON.stringify([...blocks, block], null, 2));
    };

    getBlocksAfter(hash: string): Block[] {
        type loop = { collect: boolean, newBlocks: Block[] };
        return this.loadBlockHistory().reduce((acc: loop, blockFs: BlockFs) => {
          if(blockFs.hash === hash) {
            return {
              ...acc,
              collect: true
            }
          }
          if(acc.collect) {
            return {
              ...acc,
              newBlocks: [
                ...acc.newBlocks,
                Block.fromBlockFs(blockFs)
              ]
            }
          }
          return acc;
        }, { collect: false, newBlocks: [] } as loop).newBlocks;
    }
}