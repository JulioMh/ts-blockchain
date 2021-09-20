import { Hash } from 'crypto';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

import { Balances } from '../model/Account';
import Block, { BlockFs } from '../model/Block';

const utils = (genesisPath, blockPath) => ({
  loadGenesisBalances: (): Balances => existsSync(genesisPath) ? readFile(pathToGenesis).balances : ,
  loadBlockHistory: (): BlockFs[] => existsSync(blockPath) ? readFile(pathToBlockHistory) : []
})

const pathToGenesis = path.resolve(__dirname, '../database/genesis.json');
const pathToBlockHistory = path.resolve(__dirname, '../database/block.json');

const readFile = (path: string): any => {
  return JSON.parse(readFileSync(path, { encoding: 'utf8' }));
};

export const loadGenesisBalances = (): Balances => {
  const genesis = readFile(pathToGenesis);
  return genesis.balances;
};

export const loadBlockHistory = (): BlockFs[] => {
  if (!existsSync(pathToBlockHistory)) {
    return [];
  }
  return readFile(pathToBlockHistory);
};

export const saveNewBlock = (block: BlockFs) => {
  const blocks = loadBlockHistory();
  writeFileSync(pathToBlockHistory, JSON.stringify([...blocks, block], null, 2));
};

export const getBlocksAfter = (hash: string): Block[] => {
  type loop = { collect: boolean, newBlocks: Block[] };
  return loadBlockHistory().reduce((acc, blockFs) => {
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