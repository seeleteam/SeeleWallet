"use strict"
const fs = require("fs")
const path = require('path')
const scrypt = require('scrypt-js')
const elliptic = require('elliptic');
const ec = new elliptic.ec('secp256k1');
const secp256k1 = require('secp256k1');
const { randomBytes } = require('crypto')
const createKeccakHash = require('keccak')
const utils = require('./utils')
const rlp = require('rlp')


class Wallet{
    constructor(){
        this.shardnum = 4
        this.accounts = new Array(this.shardnum)
        for (let index = 0; index < this.accounts.length; index++) {
            this.accounts[index] = new Array();
        }
    }

    create(){
        let keypair = generateKeypair()
        let shard = this.getshardnum(keypair.publickey)
        this.accounts[shard-1].push(JSON.stringify(keypair))
        return keypair
    }

    createbyshard(shard){
        let keypair
        do{
            keypair = generateKeypair()
            console.log(this.getshardnum(keypair.publickey));
            console.log(keypair.publickey);
        } while (this.getshardnum(keypair.publickey) != shard)

        this.accounts[shard-1].push(JSON.stringify(keypair))
        return keypair
    }

    getshardnum(publickey){
        if (!utils.isAddress(publickey)){
            throw new Error("Invalid publickey: "+publickey)
        }
        let sum = 0
        
        let buf = Buffer.from(publickey.substring(2), 'hex')
        for (const pair of buf.entries()) {
            if (pair[0] < 18){
                sum += pair[1]
            }
        }

        let tail = buf.readUInt16BE(18)
        sum += (tail >> 4)
        return (sum % this.shardnum) + 1
    }
}

function generateKeypair(){
    let privKey
    do {
        privKey = randomBytes(32)
    } while (!secp256k1.privateKeyVerify(privKey))
    
    // get the public key in a compressed format
    let pubKey = secp256k1.publicKeyCreate(privKey)
    pubKey = secp256k1.publicKeyConvert(pubKey, false).slice(1)

    // Only take the lower 160bits of the hash
    let address = createKeccakHash('keccak256').update(rlp.encode(pubKey)).digest().slice(-20)
    address[19] = address[19]&0xF0|1

    return {
        "publickey" : "0x" + address.toString('hex'),
        "privatekey" : "0x" + privKey.toString('hex'),
    }
}

/**
 * According to the key file path and the password to generate the key pair
 * @example
 * var keyfilePath = "C:\\Users\\dell-20\\go\\src\\github.com\\seeleteam\\go-seele\\cmd\\client\\keyfile\\shard1-0x0a57a2714e193b7ac50475ce625f2dcfb483d741"
 * var pwd = Buffer.from("123")
 * var keypair = New KeyPair(keyfilePath, pwd)
 * @param {String} keyfilePath
 * @param {Buffer} pwd
 * @todo Need to resolve the key to ecdsa, the key is ecdsa D.
 */
function scryptPrivFile(self, keyfilePath, pwd){
    keyfilePath.split(path.sep).join('/')

    var content = fs.readFileSync(keyfilePath)
    var JSONfile = JSON.parse(content)
    var cry = JSONfile.crypto
    var salt = Buffer.from(cry.salt, "hex") 
    var N = 262144, r = 8, p = 1;
    var dkLen = 32;
    scrypt(pwd, salt, N, r, p, dkLen, function(error, progress, key) {
        if (error) {
            console.log("Error: " + error)
        } else if (key) {
            console.log("Found: " + key)
            // TODO need to resolve the key to ecdsa, the key is ecdsa D.
            let keyPair = ec.keyFromPrivate("97ddae0f3a25b92268175400149d65d6887b9cefaf28ea2c078e05cdc15a3c0a");
            let privKey = keyPair.getPrivate("hex");
            let pubKey = keyPair.getPublic().encodeCompressed("hex");
            self.privateKey = privKey
            self.publicKey = pubKey
            return this
        } else {
            // update UI with progress complete
            // updateInterface(progress)
        }
    });
}

module.exports = Wallet