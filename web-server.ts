import * as express from 'express';
import { blockchain } from './index';
import { Block } from './Block';

export class WebServer {
    constructor( port: number ) {
        this.initServer(port);
    }

    private initServer = ( port: number ) => {
        const app = express();
    
        app.get('/blocks', (req, res) => {
            res.send(blockchain.getBlockchain());
        });
        app.post('/mineBlock', (req, res) => {
            const newBlock: Block = blockchain.generateNextBlock(req.body.data);
            res.send(newBlock);
        });
        app.get('/peers', (req, res) => {
            res.send(blockchain.getSockets().map(( s: any ) => s._socket.remoteAddress + ':' + s._socket.remotePort));
        });
        app.post('/addPeer', (req, res) => {
            blockchain.connectToPeers(req.body.peer);
            res.send();
        });
    
        app.listen(port, () => {
            console.log('Listening http on port: ' + port);
        });
    };

}

