import { Account } from './account'
import { Block } from './block'

export class Blockchain {
    chain: Block[]
    accounts: Account

    constructor() {
        this.chain = [Block.genesis()]
        this.accounts = new Account()
    }

    addBlock = (data: any): Block => {
        const block = Block.createBlock(this.chain[this.chain.length - 1], data)
        this.chain.push(block)

        return block
    }

    static isValidChain = (chain: Block[]): boolean => {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false
        
        for (let i = 1; i < chain.length; i++) {
            const block: Block = chain[i]
            const lastBlock: Block = chain[i - 1]

            if ((block.lastHash !== lastBlock.hash) || (block.hash !== Block.blockHash(block))) return false
        }

        return true
    }

    replaceChain = (newChain: Block[]): void => {
        if (newChain.length <= this.chain.length) {
            console.log('Received chain is not longer than the current chain')
            return
        } else if (!Blockchain.isValidChain(newChain)) {
            console.log('Received chain is invalid')
            return
        }

        console.log('Replacing the current chain with the new chain')
        this.chain = newChain
    }

    getBalance = (publicKey: string): number => this.accounts.getBalance(publicKey)
}