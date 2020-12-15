import sha256 from 'crypto-js/sha256.js'

// Create Block with index, timestamp, previousHash, hash and data.
class  Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index
        this.timestamp = timestamp
        this.data = data
        this.previousHash = previousHash
        this.hash = this.calculateHash()

    }

    calculateHash () {
        return sha256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString()     
    }
}

/**
 *  Create Blockchain with methods: 
 *  @createGenesisBlock
 *  @addBlock
 *  @getLatestBlock
 *  @checkHonesty
 */
class Blockchain {
    constructor () {
        this.chain = [this.createGenesisBlock()]
    }

    createGenesisBlock () {
        // create first block
        return new Block(0, new Date().getTime(), '0', '0')
    }
    
    getLatestBlock () {
        return this.chain[this.chain.length - 1]
    }

    addBlock (newBlock) {
        // First update the previous Hash with the hash of the latest block...
        newBlock.previousHash = this.getLatestBlock().hash
        // ...then calculate the new hash.
        newBlock.hash = newBlock.calculateHash()

        /**
         * Checks and validation tests here.
         */
        this.chain.push(newBlock)
    }

    checkHonesty () {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i -1]

            // Checks if the hash is not calculated, therefore compromised.
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                console.log('[ERROR]: Block compromised')
                return false
            }
            // Checks if the chain is valid.
            if (currentBlock.previousHash !== previousBlock.hash) {
                console.log('[ERROR]: Chain is compromised')
                return false
            }
        }
        return true
    }

}

const cryptoMark = new Blockchain()

// Create first Blocks.
cryptoMark.addBlock(new Block(1, new Date().getTime(), { amount: 1.99 }))
cryptoMark.addBlock(new Block(2, new Date().getTime(), { amount: 0.99 }))
console.log(JSON.stringify(cryptoMark, null, 4))

// Check if the chain is been compromised
cryptoMark.chain[1].data = { amount: 100 }
console.log('Is the Blockchain Valid?', cryptoMark.checkHonesty())

cryptoMark.chain[1].hash = cryptoMark.chain[1].calculateHash()

console.log('Is the Blockchain Valid?', cryptoMark.checkHonesty())