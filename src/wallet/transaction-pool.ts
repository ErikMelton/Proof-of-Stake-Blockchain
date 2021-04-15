import { TRANSACTION_THRESHOLD } from "../config";
import { Transaction } from "./transaction";

export class TransactionPool {
    transactions: Transaction[]

    constructor() {
        this.transactions = []
    }

    addTransaction = (transaction: Transaction): boolean => {
        this.transactions.push(transaction)

        if (this.transactions.length >= TRANSACTION_THRESHOLD) return true
        else return false
    }

    validTransactions = () => {
        return this.transactions.filter((transaction: Transaction) => {
            if (!Transaction.verifyTransaction(transaction)) {
                console.log(`Invalid signature from ${transaction.input?.from}`)
            }

            return transaction
        })
    }

    transactionExists = (transaction: Transaction): Transaction|undefined => {
        const exists = this.transactions.find((t: Transaction) => t.id === transaction.id)

        return exists
    }

    clear = (): void => {
        this.transactions = []
    }
}