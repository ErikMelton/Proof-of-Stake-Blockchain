import bodyParser from "body-parser"
import express from "express"
import { Blockchain } from "./blockchain/blockchain"
import { P2PServer } from "./p2p-server"
import { TransactionPool } from "./wallet/transaction-pool"
import { Wallet } from "./wallet/wallet"

const HTTP_PORT: string = process.env.HTTP_PORT || '3001'

const app = express()

app.use(bodyParser.json())

const blockchain = new Blockchain()

// Date.now() is used to create a "random" string for secret
const wallet = new Wallet(Date.now().toString())

// "Centralized" pool. TODO: Decentralize it and sync across the P2P server!
const transactionPool = new TransactionPool()

app.get('/blocks', (req, res) => {
    res.json(blockchain.chain)
})

app.post('/mine', (req, res) => {
    const block = blockchain.addBlock(req.body.data)
    console.log(`New block added: ${block.toString()}`)

    res.redirect('/blocks')

    p2pserver.syncChain()
})

app.get('/transactions', (req, res) => {
    res.json(transactionPool.transactions)
})

app.post('/transact', (req, res) => {
    const { to, amount, type } = req.body
    const transaction = wallet.createTransaction(to, amount, type, blockchain, transactionPool)

    if (transaction) p2pserver.broadcastTransaction(transaction)

    res.redirect("/transactions")
})

app.listen(HTTP_PORT, () => {
    console.log(`Listening on port ${HTTP_PORT}`)
})

const p2pserver = new P2PServer(blockchain, transactionPool)

p2pserver.listen()
