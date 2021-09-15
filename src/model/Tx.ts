import { Account } from './Account';

export default class Tx {
  from: Account;

  to: Account;

  value: number;

  constructor(from: Account, to: Account, value: number) {
    this.from = from;
    this.to = to;
    this.value = value;
  }
}
