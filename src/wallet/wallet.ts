import EDDSA from "elliptic"
import { Blockchain } from "../blockchain/blockchain"

import { ChainUtil } from "../chain-util"
import { INITIAL_BALANCE } from "../config"
import { Transaction } from "./transaction"
import { TransactionPool } from "./transaction-pool"

export class Wallet {
    balance: number
    keyPair: EDDSA.eddsa.KeyPair
    publicKey: string

    constructor(secret: EDDSA.eddsa.Bytes) {
        this.balance = INITIAL_BALANCE
        this.keyPair = ChainUtil.genKeyPair(secret)
        this.publicKey = this.keyPair.getPublic("hex")
    }

    toString = (): string =>
        `Wallet - publicKey: ${this.publicKey.toString()} balance: ${this.balance}`

    sign = (dataHash: EDDSA.eddsa.Bytes): string =>
        this.keyPair.sign(dataHash).toHex()
    
    createTransaction = (to: string, amount: number, type: string, blockchain: Blockchain, transactionPool: TransactionPool): Transaction|undefined => {
        let transaction = Transaction.newTransaction(this, to, amount, type)
        
        if (transaction) {
            transactionPool.addTransaction(transaction)
            
            return transaction
        }

        console.log('Could not create transaction')
        
        return
    }
}
