import { Transaction } from "../wallet/transaction"

export class Validators {
    list: string[]

    constructor() {
        this.list = []
    }

    update = (transaction: Transaction): boolean => {
        if (transaction.output?.amount == 30 && transaction.output.to == "0" && transaction.input?.from) {
            this.list.push(transaction.input.from)

            return true
        }

        return false
    }
}