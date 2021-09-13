"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const State_1 = __importDefault(require("../model/State"));
const Tx_1 = __importDefault(require("../model/Tx"));
const body_parser_1 = __importDefault(require("body-parser"));
class Node {
    constructor(port) {
        this.port = port;
        this.app = (0, express_1.default)();
        this.app.use(body_parser_1.default.urlencoded({
            extended: true
        }));
        this.app.use(body_parser_1.default.json());
        this.app.get('/balances', (req, res, next) => {
            const state = State_1.default.newStateFromDisk();
            res.send(state.balances);
            next();
        });
        this.app.post('/tx', (req, res, next) => {
            console.log(req.body);
            const { from, to, value } = req.body;
            const state = State_1.default.newStateFromDisk();
            state.addTx(new Tx_1.default(from, to, value));
            res.send(200);
            next();
        });
    }
    start() {
        this.server = this.app.listen(this.port, () => {
            console.log(`New node for sync-blockchain running on http://localhost:${this.port}`);
        });
    }
    stop() {
        var _a;
        (_a = this.server) === null || _a === void 0 ? void 0 : _a.close(() => {
            console.log(`Closing node running on http://localhost:${this.port}`);
        });
    }
    static getNode(port) {
        if (Node.node) {
            return Node.node;
        }
        if (!port) {
            throw new Error('Port argument is missing');
        }
        return new Node(port);
    }
}
exports.default = Node;
//# sourceMappingURL=node.js.map