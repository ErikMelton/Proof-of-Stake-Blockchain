import bodyParser from "body-parser"
import express from "express"
import { Blockchain } from "./blockchain/blockchain"
import { P2PServer } from "./p2p-server"

const HTTP_PORT: string = process.env.HTTP_PORT || '3001'

const app = express()

app.use(bodyParser.json())

const blockchain = new Blockchain()

app.get('/blocks', (req, res) => {
    res.json(blockchain.chain)
})

app.post('/mine', (req, res) => {
    const block = blockchain.addBlock(req.body.data)
    console.log(`New block added: ${block.toString()}`)

    res.redirect('/blocks')

    p2pserver.syncChain()
})

app.listen(HTTP_PORT, () => {
    console.log(`Listening on port ${HTTP_PORT}`)
})

const p2pserver = new P2PServer(blockchain)

p2pserver.listen()
