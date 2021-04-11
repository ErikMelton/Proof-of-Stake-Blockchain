import 'ws'
import WebSocket from 'ws'
import { Blockchain } from './blockchain/blockchain'

const P2P_PORT: number = parseInt(process.env.P2P_PORT || '') || 5001
const peers = process.env.PEERS ? process.env.PEERS.split(',') : ['ws://localhost:5002']

export class P2PServer {
    blockchain: Blockchain
    sockets: WebSocket[]

    constructor(blockchain: Blockchain) {
        this.blockchain = blockchain
        this.sockets = []
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
            console.log('data: ', data)

            this.blockchain.replaceChain(data.chain)
        })
    }

    sendChain = (socket: WebSocket): void => {
        socket.send(JSON.stringify(this.blockchain.chain))
    }

    syncChain = (): void => {
        this.sockets.forEach((socket: WebSocket) => {
            this.sendChain(socket)
        })
    }
}
