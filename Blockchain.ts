import { Block } from "./Block";

export class Blockchain {

    private blockchain: Block[];

    constructor() {
        this.blockchain = [this.startGenesisBlock()];
    }

    public getBlockchain = (): Block[] => {
        return this.blockchain;
    };

    startGenesisBlock(): Block {
        return new Block(0, '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7', null, 1465154705, 'my genesis block!!');
    }

    generateNextBlock = (blockData: string) => {
        const previousBlock: Block = this.getLatestBlock();
        const nextIndex: number = previousBlock.index + 1;
        const nextTimestamp: number = new Date().getTime() / 1000;
        const nextHash: string = Block.calculateBlockHash(nextIndex, previousBlock.hash, nextTimestamp, blockData);
        const newBlock: Block = new Block(nextIndex, nextHash, previousBlock.hash, nextTimestamp, blockData);
        return newBlock;
    };

    getLatestBlock = (): Block => {
        return this.blockchain[this.blockchain.length - 1];
    };

    private isValidNewBlock = (newBlock: Block, previousBlock: Block) => {
        if (previousBlock.index + 1 !== newBlock.index) {
            console.log('invalid index');
            return false;
        } else if (previousBlock.hash !== newBlock.previousHash) {
            console.log('invalid previoushash');
            return false;
        } else if (this.calculateHashForBlock(newBlock) !== newBlock.hash) {
            console.log(typeof (newBlock.hash) + ' ' + typeof this.calculateHashForBlock(newBlock));
            console.log('invalid hash: ' + this.calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
            return false;
        }
        return true;
    };
    
    isValidBlockStructure = (block: Block): boolean => {
        return typeof block.index === 'number'
            && typeof block.hash === 'string'
            && typeof block.previousHash === 'string'
            && typeof block.timestamp === 'number'
            && typeof block.data === 'string';
    };
    
    calculateHashForBlock(newBlock: Block) {
        return Block.calculateBlockHash(newBlock.index, newBlock.previousHash!, newBlock.timestamp, newBlock.data);
    }

    isValidChain = (chain: Block[]): boolean => {
        let valid = true;
        const isValidGenesis = (block: Block): boolean => {
            return JSON.stringify(block) === JSON.stringify(this.blockchain[0]);
        };
    
        if (!isValidGenesis(chain[0])) {
            valid = false;
        }
    
        chain.every((block: Block) => {
            if (!this.isValidBlockStructure(block)) {
                valid = false;
                return false;
            }
            if (block.index > 0) {
                if (!this.isValidNewBlock(block, chain[block.index - 1])) {
                    valid = false;
                    return false;
                }
            }
            return true;
        })
        return valid;
    };

    replaceChain = (newBlocks: Block[]) => {
        if (this.isValidChain(newBlocks) && newBlocks.length > this.getBlockchain().length) {
            console.log('Received blockchain is valid. Replacing current blockchain with received blockchain');
            this.blockchain = newBlocks;
            this.broadcastLatest();
        } else {
            console.warn('Received blockchain invalid');
        }
    };

    broadcastLatest = () => {
        console.log('broadcastLatest: ' + JSON.stringify(this.getBlockchain()));
    };

    getSockets = () => {
        return [];
    };

    connectToPeers = (peer: string) => {
        console.log('connectToPeers: ' + peer);
    };
}
