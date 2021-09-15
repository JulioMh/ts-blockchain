import { NextFunction, Request, Response } from "express";
import Block from "../model/Block";
import State from "../model/State";
import Tx from "../model/Tx";
import { statusResMap } from "./dto/Status";
import { PeerNode, StatusRes } from "./Node";

export const postTx = (state: State) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { from, to, value } = req.body;
    const tx = new Tx(from, to, value);

    const block = new Block(state.getLatestBlockHash(), state.getLatestBlockNumber(), new Date().valueOf(), [tx])
    state.addBlock(block)

    res.status(200).send(state.getLatestBlockHash())
    next()
  }
}

export const getBlanaces = (state: State) => {
  return (req: Request, res: Response, next: NextFunction) => {
    res.send(state.balances)
    next()
  }
}

export const getStatus = (state: State, peersKnown: PeerNode[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const statusRes: StatusRes = {
      blockHash: state.getLatestBlockHash(),
      blockNumber: state.getLatestBlockNumber(),
      peersKnown: peersKnown
    }
    
    res.send(statusResMap(statusRes))
    next()
  }
}

export const handleErrors = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(
    "------------------------------------------------------------------"
  );
  console.log(`ERROR:\t${error.message}`);
  console.log(`METHOD:\t${req.method}`);
  console.log(`URL:\t${req.url}`);
  console.log(`BODY:\t${JSON.stringify(req.body)}`);
  console.log(
    "------------------------------------------------------------------"
  );
  const jsonResponse = { message: error.message };
  res.status(500).send(jsonResponse);
}