import SHA256 from 'crypto-js/sha256'

export class Block {
    timestamp: number
    lastHash: string
    hash: string
    data: any
    validator?: string
    signature?: string

    constructor(timestamp: number, lastHash: string, hash: string, data: any, validator?: string, signature?: string) {
        this.timestamp = timestamp
        this.lastHash = lastHash
        this.hash = hash
        this.data = data
        this.validator = validator
        this.signature = signature
    }

    toString = (): string => {
        return `Block - 
            Timestamp: ${this.timestamp}
            Last Hash: ${this.lastHash}
            Hash: ${this.hash}
            Data: ${this.data}
            Validator: ${this.validator}
            Signature: ${this.signature}`
    }

    static genesis = (): Block => {
        return new Block(0, "----", "genesis-hash", [])
    }

    static hash = (timestamp: number, lastHash: string, data: any): string => {
        return SHA256(`${timestamp}${lastHash}${data}`).toString()
    }

    static createBlock = (lastBlock: Block, data: any): Block => {
        let hash
        let timestamp = Date.now()
        const lastHash = lastBlock.hash

        hash = Block.hash(timestamp, lastHash, data)

        return new Block(timestamp, lastHash, hash, data)
    }

    static blockHash = (block: Block): string => {
        const { timestamp, lastHash, data } = block

        return Block.hash(timestamp, lastHash, data)
    }
}
