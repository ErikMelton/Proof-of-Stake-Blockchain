import { Transaction } from '../wallet/transaction'
import { Wallet } from '../wallet/wallet'
import { Account } from './account'
import { Block } from './block'
import { Stake } from './stake'
import { Validators } from './validators'

const secret = "I am the first leader"

const TRANSACTION_TYPE = {
    transaction: "TRANSACTION",
    stake: "STAKE",
    validator_fee: "VALIDATOR_FEE"
}

export class Blockchain {
    chain: Block[]
    accounts: Account
    validators: Validators
    stakes: Stake

    constructor() {
        this.chain = [Block.genesis()]
        this.accounts = new Account()
        this.validators = new Validators()
        this.stakes = new Stake()
    }

    addBlock = (data: any): Block => {
        const block = Block.createBlock(this.chain[this.chain.length - 1], data, new Wallet(secret))
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

    getLeader = () => this.stakes.getMax(this.validators.list)

    createBlock = (transactions: Transaction[], wallet: Wallet): Block => Block.createBlock(
        this.chain[this.chain.length - 1],
        transactions,
        wallet
    )

    isValidBlock = (block: Block): boolean => {
        const lastBlock = this.chain[this.chain.length - 1]

        if (block.lastHash === lastBlock.hash && block.hash == Block.blockHash(block) &&
            Block.verifyBlock(block) && Block.verifyLeader(block, this.getLeader())
        ) {
            console.log('The block is valid')

            this.addBlock(block)

            return true
        }

        return false
    }

    executeTransactions = (block: Block): void => {
        block.data.forEach((transaction: Transaction) => {
            switch (transaction.type) {
                case TRANSACTION_TYPE.transaction:
                    this.accounts.update(transaction)
                    this.accounts.transferFee(block, transaction)
                    break;
                
                case TRANSACTION_TYPE.stake:
                    if (transaction.input?.from && transaction.output?.amount) {
                        this.stakes.update(transaction)
                        this.accounts.decrement(transaction.input?.from, transaction.output?.amount)
                        this.accounts.transferFee(block, transaction)
                    }
                    break;
                
                case TRANSACTION_TYPE.validator_fee:
                    if (this.validators.update(transaction) && transaction.input?.from && transaction.output?.amount) {
                        this.accounts.decrement(transaction.input?.from, transaction.output?.amount)
                        this.accounts.transferFee(block, transaction)
                    }
                    break
            }
        })
    }
}