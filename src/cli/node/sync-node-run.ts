import { program } from 'commander';

import NodeList from '../../web/Node';

program.option('-p, --port', 'Node port to be used, default to 8080');

program.parse(process.argv);

const { port = 8080 } = program.opts();

const nodeList = NodeList.getNodeList();

nodeList.getNode(port).start();
