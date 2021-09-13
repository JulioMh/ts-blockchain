import State from '../model/State'
import Block from '../model/Block'
import Tx from '../model/Tx';

const state = State.newStateFromDisk();

const block0 = new Block(
  String(0).padStart(32, '0'),
  new Date().valueOf(),
  [
    new Tx('andrej', 'julio', 1000),
    new Tx('julio', 'juan', 500)
  ]
);

state.addBlock(block0);
state.persist()