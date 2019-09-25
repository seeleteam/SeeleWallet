const createKeccakHash = require('keccak')  // for hashing
var RLP = require('rlp')                    // for serialization
var secp256k1 = require('secp256k1')        // for elliptic operations
class stx{
  //***********************************
  // public methods
  //***********************************
  
  // public method: returns the signature result in json format from tx information and privateKey
  // ps. the only public method
  // input: string[66]
  /*        tx = {
                 "to": "0x27266c2b5706e9282546750764531c71052e0281",
                 "amount": 0.4,
                 "price":10.56,
                 "limit":200000.1,
                 "payload":"0x0101",
                 "nonce": 0
               }
  output: signedTransaction = {
             "Hash": "0xcaa03e211b3e89b991f8f1c1cff4d8640611eae4f634d435704c7ad2b42d08c4",
             "Data": {
                 "Type": 0,
                 "From": "0x724fdfef2ea6411d6fed3bb95bad56da4170e0e1",
                 "To": "0x27266c2b5706e9282546750764531c71052e0281",
                 "Amount": 0,
                 "AccountNonce": 0,
                 "GasPrice": 10,
                 "GasLimit": 200000,
                 "Timestamp": 0,
                 "Payload": "0x0101"
             },
             "Signature": {
                 "Sig": "kIk8Lx+/h3+0/TuQYvHeU5q9YJkUPE7/7zgD3rlLPatfhEJWMCnCVFHGApFSnzJCXl8jbPBhHXoixLQzVTwcSQA="
             }
         }*/
         
  generate (shard) {
      return privatekey
  }
  
  sign(privateKey, tx){
    // step 1/5 check tx validity
    if (!this.txValidity(tx)) {
      return "failed to sign"
    }
    // step 2/5 initialize tx data values for hashing (also checks privateKey validity in publicKeyOf())
    this.pubKey=this.publicKeyOf(privateKey);
    this.timestamp=0;
    this.type=0;
    this.Data={
      "Type":       this.type,
      "From":       this.pubKey,
      "To":           tx.to,
      "Amount":       parseInt(tx.amount.toString()),
      "AccountNonce": parseInt(tx.nonce.toString()),
      "GasPrice":     parseInt(tx.price.toString()),
      "GasLimit":     parseInt(tx.limit.toString()),
      "Timestamp":  this.timestamp,
      "Payload":      tx.payload
    }
    // step 3/5 hash tx data values
    this.hash=this.hash();
    // step 4/5 create signature from hash (of tx data values) and private key
    this.sign=this.signHash(this.hash, privateKey);
    // step 5/5 finalize returned signed tx data
    this.signedTransaction={
      "Hash": "0x"+this.hash,
      "Data": this.Data,
      "Signature": {
        "Sig": this.sign
      }
    }
    return this.signedTransaction
  }
  
  //***********************************
  // private methods
  //***********************************
  
  // private method: returns public key of given private key, but also throws error if invalid input
  // input string[66]
  // output string[42]
  publicKeyOf(privateKey){
    if (privateKey.length!=66){throw "privatekey string should be of lenth 66"} 
    if (privateKey.slice(0,2)!="0x"){throw "privateKey string should start with 0x"}
    const inbuf = Buffer.from(privateKey.slice(2), 'hex');
    if (!secp256k1.privateKeyVerify(inbuf)){throw "invalid privateKey"}
    const oubuf = secp256k1.publicKeyCreate(inbuf, false).slice(1);
    var publicKey = createKeccakHash('keccak256').update(RLP.encode(oubuf)).digest().slice(12).toString('hex')
    return "0x"+publicKey.replace(/.$/i,"1")
  }
  
  // private method: returns hash string from VALUES OF TXDATA
  // ps. the VALUES only, NOT the FIELDS and the VALUES
  // input none, but uses class properties(contents of this.Data, this.Data.Type ... etc)
  // output string[64]
  hash(){
    var infolist = [
      this.Data.Type,
      this.Data.From,
      this.Data.To,
      this.Data.Amount,
      this.Data.AccountNonce,
      this.Data.GasPrice,
      this.Data.GasLimit,
      this.Data.Timestamp,
      this.Data.Payload
    ]
    return createKeccakHash('keccak256').update(RLP.encode(infolist)).digest().toString('hex')
  }
  
  // private method: returns signature from tx data hash and privateKey (0x included)
  // input string[64], string[66]
  // output string[88]
  signHash(hash, privateKey){
    var signature = secp256k1.sign(Buffer.from(hash, 'hex'), Buffer.from(privateKey.slice(2), 'hex'))
    return Buffer.concat([signature.signature,Buffer.from([signature.recovery])]).toString('base64')
  }
  
  // private method: display result
  // input none,
  // output none,
  show(){
    console.log(JSON.stringify(this.signedTransaction,null,4))
  }
  
  // private method: returns true/false as validity of each field of input tx data:
  //                 numerical types (nonce, amount, price, limit) must all be non-negative and are numbers, decimals are allowed but will be ignored
  //                 string  types (to, payload) must be strings and reciever address must be valid address with prefix 0x
  /* input ex tx = {
                 "to": "0x27266c2b5706e9282546750764531c71052e0281",
                 "amount": 0.4,
                 "price":10.56,
                 "limit":200000.1,
                 "payload":"0x0101",
                 "nonce": 0
               }*/
  // output bool
  txValidity(tx){
    if (typeof tx.to !== 'string' || tx.to.length!=42 || tx.to.slice(0,2)!="0x"){
      throw "invalid receiver address, should be of length 42 with prefix 0x"
      return false
    }
    if (typeof tx.payload !== 'string'){
      throw "invalid payload"
      return false
    }
    if (typeof tx.nonce !== 'number' || tx.nonce < 0) {
      console.log(typeof tx.nonce)
      throw "invalid nonce" 
      return false
    }
    if (typeof tx.amount !== 'number' || tx.amount < 0) {
      console.log(typeof tx.amount)
      throw "invalid amount" 
      return false
    }
    if (typeof tx.price !== 'number' || tx.price < 0) {
      console.log(typeof tx.price)
      throw "invalid price" 
      return false
    }
    if (typeof tx.limit !== 'number' || tx.limit < 0) {
      console.log(typeof tx.limit)
      throw "invalid limit" 
      return false
    }
    return true
    
    //nonce, amount, price and limit must be positive integers
  }
}

module.exports = stx;