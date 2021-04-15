import bodyParser from "body-parser"
import express from "express"
import { Blockchain } from "../blockchain/blockchain"
import { TRANSACTION_THRESHOLD } from "../config"
import { P2PServer } from "../p2p-server"
import { Transaction } from "../wallet/transaction"
import { TransactionPool } from "../wallet/transaction-pool"
import { Wallet } from "../wallet/wallet"

const HTTP_PORT: number = 3000

const app = express()

app.use(bodyParser.json())

const blockchain: Blockchain = new Blockchain()
const wallet = new Wallet("I am the first leader")
const transactionPool = new TransactionPool()
const p2pserver = new P2PServer(blockchain, transactionPool, wallet)

app.get("/ico/transactions", (req, res) => {
    res.json(transactionPool.transactions)
})

app.get("/ico/blocks", (req, res) => {
    res.json(blockchain.chain)
})

app.post("/ico/transact", (req, res) => {
    const { to, amount, type } = req.body
    const transaction: Transaction|undefined = wallet.createTransaction(
        to,
        amount,
        type,
        blockchain,
        transactionPool
    )

    if (transaction) p2pserver.broadcastTransaction(transaction)

    if (transactionPool.transactions.length >= TRANSACTION_THRESHOLD) {
        const block = blockchain.createBlock(transactionPool.transactions, wallet)
        p2pserver.broadcastBlock(block)
    }

    res.redirect("/ico/transactions")
})

app.get("/ico/public-key", (req, res) => {
    res.json({ publicKey: wallet.publicKey })
})

app.get("/ico/balance", (req, res) => {
    res.json({ balance: blockchain.getBalance(wallet.publicKey) })
})

app.post("/ico/balance-of", (req, res) => {
    res.json({ balance: blockchain.getBalance(req.body.publicKey) })
})

app.listen(HTTP_PORT, () => {
    console.log(`Listening on port ${HTTP_PORT}`)
})

p2pserver.listen()