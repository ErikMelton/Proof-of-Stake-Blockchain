import { Transaction } from "../wallet/transaction"

export class Stake {
    addresses: string[]
    balance: { [address: string]: number }

    constructor() {
        this.addresses = [""]
        this.balance = { "a": 0 }
    }

    initialize = (address: string) => {
        if (this.balance[address] == undefined) {
            this.balance[address] = 0
            this.addresses.push(address)
        }
    }

    addStake = (from: string, amount: number) => {
        this.initialize(from)
        this.balance[from] += amount
    }

    getBalance = (address: string): number => {
        this.initialize(address)

        return this.balance[address]
    }

    getMax = (addresses: string[]): string => {
        let balance = -1
        let leader: string = ""

        addresses.forEach(address => {
            if (this.getBalance(address) > balance) {
                leader = address
            }
        });

        return leader
    }
    
    update = (transaction: Transaction) => {
        const amount = transaction.output?.amount
        const from = transaction.input?.from

        if (amount && from) {
            this.addStake(from, amount)  
        }
    }
}