import { Transaction } from "./transaction";

export class TransactionPool {
    transactions: Transaction[]

    constructor() {
        this.transactions = []
    }

    addTransaction = (transaction: Transaction): void => {
        this.transactions.push(transaction)
    }

    validTransactions = () => {
        return this.transactions.filter((transaction: Transaction) => {
            if (!Transaction.verifyTransaction(transaction)) {
                console.log(`Invalid signature from ${transaction.input?.from}`)
            }

            return transaction
        })
    }
}