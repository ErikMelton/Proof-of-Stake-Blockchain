import EDDSA from "elliptic"

import { ChainUtil } from "../chain-util"
import { TRANSACTION_FEE } from "../config"
import { Wallet } from "./wallet"

interface TransactionInput {
  timestamp: number
  from: string
  signature: string
}

interface TransactionOutput {
    to: string,
    amount: number,
    fee: number,
}

export class Transaction {
    id: string
    type: string | null
    input: TransactionInput | null
    output: TransactionOutput | null

    constructor() {
        this.id = ChainUtil.id()
        this.type = null
        this.input = null
        this.output = null
    }

    static newTransaction = (senderWallet: Wallet, to: string, amount: number, type: string): Transaction | undefined => {
        if (amount + TRANSACTION_FEE > senderWallet.balance) {
            console.log("Not enough balance")

            return
        }

        return Transaction.generateTransaction(senderWallet, to, amount, type)
    }

    static generateTransaction = (senderWallet: Wallet, to: string, amount: number, type: string): Transaction => {
        const transaction = new Transaction()

        transaction.type = type
        transaction.output = {
            to: to,
            amount: amount - TRANSACTION_FEE,
            fee: TRANSACTION_FEE,
        }

        Transaction.signTransaction(transaction, senderWallet)

        return transaction
    }

    static signTransaction = (transaction: Transaction, senderWallet: Wallet) => {
        transaction.input = {
            timestamp: Date.now(),
            from: senderWallet.publicKey,
            signature: senderWallet.sign(ChainUtil.hash(transaction.output)),
        }
    }

    static verifyTransaction = (transaction: Transaction) => {
        if (transaction.input) {
            return ChainUtil.verifySignature(transaction.input.from, transaction.input.signature, ChainUtil.hash(transaction.output))
        }

        console.log('Could not verify transaction; missing input')
        
        return
    }
}
