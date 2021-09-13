import { readFileSync, writeFileSync, existsSync } from 'fs'
import crypto from 'crypto'
import { Balances } from '../model/Account'
import Tx from '../model/Tx'
import path from 'path'
import Block, { BlockFs } from '../model/Block'

const pathToTxHistory = path.resolve(__dirname, '../database/tx.json')
const pathToGenesis = path.resolve(__dirname, '../database/genesis.json')
const pathToBlockHistory = path.resolve(__dirname, '../database/block.json')

const readFile = (path: string): any => {
  return JSON.parse(readFileSync(path, {encoding:'utf8'}))
}

export const loadGenesisBalances = (): Balances => {
  const genesis = readFile(pathToGenesis)
  return genesis.balances 
}

export const loadTxHistory = (): Tx[] => {
  const rawTxs = readFile(pathToTxHistory)
  return rawTxs.map((rawTx: any) => new Tx(rawTx.from, rawTx.to, rawTx.value))
}

export const loadBlockHistory = (): BlockFs[] => {
  return readFile(pathToBlockHistory)
}

export const saveTxHistory = (txHistory: Tx[]) => {
  writeFileSync(pathToTxHistory, JSON.stringify(txHistory, null, 2))
}

export const saveNewBlock = (block: BlockFs) => {
  const blocks = readFile(pathToBlockHistory);
  writeFileSync(pathToBlockHistory, JSON.stringify([...blocks, block], null, 2))
}

export const hashBlock = (block: Block) => {
  const hashSum = crypto.createHash('sha256');
  hashSum.update(JSON.stringify(block))

  return hashSum.digest('hex')
}