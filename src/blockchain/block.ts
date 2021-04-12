import { ChainUtil } from '../chain-util'

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

    static createBlock = (lastBlock: Block, data: any): Block => {
        let hash
        let timestamp = Date.now()
        const lastHash = lastBlock.hash

        hash = ChainUtil.hash(`${timestamp}${lastHash}${data}`)

        return new Block(timestamp, lastHash, hash, data)
    }

    static blockHash = (block: Block): string => {
        const { timestamp, lastHash, data } = block

        return ChainUtil.hash(`${timestamp}${lastHash}${data}`)
    }
}
