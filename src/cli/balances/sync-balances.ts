import { program } from 'commander';
import path from 'path';

const pathToList = path.resolve(__dirname, './sync-balances-list.js');

program.command('list', 'List balances', { executableFile: pathToList });
program.action(() => {
  program.help();
});
program.parse(process.argv);
