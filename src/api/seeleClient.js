// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var seelejs = require('seele.js');
var fs = require('fs');
var os = require("os")

const Q = require('bluebird');
const spawn = require('child_process').spawn;
const spawnSync = require('child_process').spawnSync;

function seeleClient() {
    // this.client1 = new seelejs("http://106.75.86.211:8037");
    // this.client2 = new seelejs("http://106.75.86.211:8038");
    this.client1 = new seelejs();
    this.client2 = new seelejs();

    this.accountPath = os.homedir() + "/.seeleMist/account/"

    this.binPath = function() {
        var clientpath = `${__dirname}`;
        if (clientpath.indexOf("app.asar") > 0) {
            return clientpath.substring(0, clientpath.indexOf("app.asar")) + "/../client";
        } else {
            return "./cmd/win32/client"
        }
    };

    this.accountArray = [];

    this.init = function() {
        if (!fs.existsSync(this.accountPath)) {
            fs.mkdirSync(os.homedir() + "/.seeleMist/")
            fs.mkdirSync(this.accountPath)
        }
    };

    this.generateKey = function(shardnum, passWord) {
        this.init();
        return new Q((resolve, reject) => {
            try {
                var args = [
                    'key',
                ];
                if (shardnum != "") {
                    args.push('--shard', shardnum)
                }

                const proc = spawn(this.binPath(), args);

                proc.stdout.on('data', data => {
                    var output = `${data}`
                    var privatekey = this.ParsePrivateKey(output)
                    var publickey = this.ParsePublicKey(output)
                    this.keyStore(publickey, privatekey, passWord)
                    resolve(publickey)
                });

                proc.stderr.on('data', data => {
                    reject(data)
                });
            } catch (e) {
                return reject(e)
            }
        });
    };

    this.getshardnum = function(publicKey) {
        var args = [
            'getshardnum',
        ];
        args.push('--account', publicKey)
        const proc = spawnSync(this.binPath(), args);

        var info = `${proc.stdout}`
        if (info == "") {
            var err = `${proc.stderr}`
            return err
        }
        return info.replace("shard number:", "").trim()
    };

    this.keyStore = function(fileName, privatekey, passWord) {
        return new Q((resolve, reject) => {
            var args = [
                'savekey',
            ];

            var filePath = this.accountPath + fileName;

            this.accountArray.push(fileName);

            args.push("--privatekey", privatekey)
            args.push("--file", filePath)

            const proc = spawn(this.binPath(), args);

            proc.stdout.on('data', data => {
                proc.stdin.write(passWord + '\n');
                resolve(data)
            });

            proc.stderr.on('data', data => {
                reject(data)
            });
        });
    };

    this.DecKeyFile = function(fileName, passWord) {
        return new Q((resolve, reject) => {
            var args = [
                'deckeyfile',
            ];

            var filePath = this.accountPath + fileName;

            args.push("--file", filePath)

            const proc = spawn(this.binPath(), args);

            proc.stdout.on('data', data => {
                proc.stdin.write(passWord + '\n');
                var output = `${data}`
                if (output.indexOf("private") > 0) {
                    resolve(data)
                }
            });

            proc.stderr.on('data', data => {
                reject(data)
            });
        });
    };

    this.accountList = function() {
        if (fs.existsSync(this.accountPath)) {
            this.accountArray = fs.readdirSync(this.accountPath)
        } else {
            console.log(this.accountPath + "  Not Found!");
        }
    };

    this.getBalance = function(publicKey, callBack) {
        try {
            var numberInfo = this.getshardnum(publicKey)
            if (numberInfo == "1") {
                this.client1.getBalance(publicKey, callBack);
            } else if (numberInfo == "2") {
                this.client2.getBalance(publicKey, callBack);
            } else {
                alert(numberInfo)
            }
        } catch (e) {
            console.error("no node started in local host")
        }
    };

    this.getBalanceSync = function(publicKey) {
        try {
            var numberInfo = this.getshardnum(publicKey)
            if (numberInfo == "1") {
                return this.client1.sendSync("getBalance", publicKey);
            } else if (numberInfo == "2") {
                return this.client2.sendSync("getBalance", publicKey);
            } else {
                alert(numberInfo)
            }
        } catch (e) {
            console.error("no node started in local host")
        }
    }

    this.sendtx = function(publicKey, passWord, to, amount, price, payload, callBack) {
        var client
        var numberInfo = this.getshardnum(publicKey)
        if (numberInfo == "1") {
            client = this.client1;
        } else if (numberInfo == "2") {
            client = this.client2;
        } else {
            // alert(numberInfo)
            return
        }

        var nonce = client.sendSync("getAccountNonce", publicKey);

        var rawTx = {
            "From": publicKey,
            "To": to,
            "Amount": parseInt(amount),
            "AccountNonce": nonce,
            "GasPrice": parseInt(price),
            "GasLimit": 3000000,
            "Timestamp": 0,
            "Payload": payload
        }

        this.DecKeyFile(publicKey, passWord).then((data) => {
            var output = `${data}`
            var privatekey = this.ParsePrivateKey(output);
            var tx = client.generateTx(privatekey, rawTx);
            client.addTx(tx, function(err, info) {
                callBack(err, info, tx.Hash);
            });
        });
    };

    this.gettxbyhash = function(hash, publickey, callBack) {
        var client
        var numberInfo = this.getshardnum(publickey)
        if (numberInfo == "1") {
            client = this.client1;
        } else if (numberInfo == "2") {
            client = this.client2;
        } else {
            alert(numberInfo)
            return
        }
        client.getTransactionByHash(hash, callBack);
    }

    this.ParsePublicKey = function(input) {
        try {
            return input.substring(input.indexOf("publick key:") + 12, input.indexOf("private key:")).trim()
        } catch (e) {
            return ""
        }
    };

    this.ParsePrivateKey = function(input) {
        try {
            return input.substring(input.indexOf("private key:") + 12).trim()
        } catch (e) {
            return ""
        }
    };

    this.getblock = function (shard, hash, height, fulltx, callBack) {
        if (shard == "1") {
            this.client1.getBlock(hash, height, fulltx, callBack);
        }else if (shard == "2") {
            this.client2.getBlock(hash, height, fulltx, callBack);
        }
    };

    this.getblockheight = function (shard, callBack) {
        if (shard == "1") {
            this.client1.getBlockHeight(callBack);
        }else if (shard == "2") {
            this.client2.getBlockHeight(callBack);
        }
    };

    this.isListening = function (shard, callBack) {
        if (shard == "1") {
            this.client1.isListening(callBack);
        }else if (shard == "2") {
            this.client2.isListening(callBack);
        }
    };
}

module.exports = seeleClient;
