import 'ws'
import WebSocket from 'ws'
import { Blockchain } from './blockchain/blockchain'
import { Transaction } from './wallet/transaction'
import { TransactionPool } from './wallet/transaction-pool'

interface MessageType {
    chain: string,
    transaction: string
}

const P2P_PORT: number = parseInt(process.env.P2P_PORT || '') || 5001
const peers: string[] = process.env.PEERS ? process.env.PEERS.split(',') : [] // 'ws://localhost:5002'

const MESSAGE_TYPE: MessageType = {
    chain: "CHAIN",
    transaction: "TRANSACTION",
}

export class P2PServer {
    blockchain: Blockchain
    sockets: WebSocket[]
    transactionPool: TransactionPool

    constructor(blockchain: Blockchain, transactionPool: TransactionPool) {
        this.blockchain = blockchain
        this.sockets = []
        this.transactionPool = transactionPool
    }

    listen = (): void => {
        const server = new WebSocket.Server({ port: P2P_PORT })

        server.on("connection", (socket: WebSocket) => this.connectSocket(socket))

        this.connectToPeers()

        console.log(`Listening for peer to peer connection on port: ${P2P_PORT}`)
    }

    connectSocket = (socket: WebSocket): void => {
        this.sockets.push(socket)
        console.log("Socket connected")

        this.messageHandler(socket)

        this.sendChain(socket)
    }

    connectToPeers = (): void => {
        peers.forEach(peer => {
            const socket = new WebSocket(peer)
            
            socket.on('open', () => this.connectSocket(socket))
        })
    }

    messageHandler = (socket: WebSocket): void => {
        socket.on('message', (message: WebSocket.Data) => {
            const data = JSON.parse(message.toString())
            console.log('Received data from peer: ', data)

            switch (data.type) {
                case MESSAGE_TYPE.chain:
                    this.blockchain.replaceChain(data.chain)
                    break
                
                case MESSAGE_TYPE.transaction:
                    if (!this.transactionPool.transactionExists(data.transaction)) {
                        this.transactionPool.addTransaction(data.transaction)
                        this.broadcastTransaction(data.transaction)
                    }
                    break
            }
        })
    }

    sendChain = (socket: WebSocket): void => {
        socket.send(JSON.stringify({
            type: MESSAGE_TYPE.chain,
            chain: this.blockchain.chain
        }))
    }

    syncChain = (): void => {
        this.sockets.forEach((socket: WebSocket) => {
            this.sendChain(socket)
        })
    }

    broadcastTransaction = (transaction: Transaction): void => {
        this.sockets.forEach(socket => {
            this.sendTransaction(socket, transaction)
        })
    }

    sendTransaction = (socket: WebSocket, transaction: Transaction): void => {
        socket.send(JSON.stringify({
            type: MESSAGE_TYPE.transaction,
            transaction: transaction
        }))
    }
}
