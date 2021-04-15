import { Transaction } from "../wallet/transaction"
import { Block } from "./block"

export class Account {
    addresses: string[]
    balance: { [address: string]: number }

    constructor() {
        this.addresses = []
        this.balance = {}
    }

    initialize = (address: string): void => {
        if (this.balance[address] == undefined) {
            this.balance[address] = 0
            this.addresses.push(address)
        }
    }

    transfer = (from: string, to: string, amount: number): void => {
        this.initialize(from)
        this.initialize(to)
        this.increment(to, amount)
        this.decrement(from, amount)
    }

    increment = (to: string, amount: number): void => {
        this.balance[to] += amount
    }

    decrement = (from: string, amount: number): void => {
        this.balance[from] -= amount
    }

    getBalance = (address: string): number => {
        this.initialize(address)

        return this.balance[address]
    }

    update = (transaction: Transaction): void => {
        const amount = transaction.output?.amount
        const from = transaction.input?.from
        const to = transaction.output?.to

        if (amount && from && to) this.transfer(from, to, amount)
    }

    transferFee = (block: Block, transaction: Transaction): void => {
        const amount = transaction.output?.fee
        const from = transaction.input?.from
        const to = block.validator

        if (amount && from && to) {
            this.transfer(from, to, amount)
        }
    }
}