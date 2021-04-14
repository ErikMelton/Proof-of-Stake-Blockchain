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

    transactionExists = (transaction: Transaction): Transaction|undefined => {
        const exists = this.transactions.find((t: Transaction) => t.id === transaction.id)

        return exists
    }
}