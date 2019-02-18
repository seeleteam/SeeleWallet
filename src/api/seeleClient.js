// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var seelejs = require('seele.js');
var fs = require('fs');
var os = require("os")
var path = require('path');

const Q = require('bluebird');
const spawn = require('child_process').spawn;
const spawnSync = require('child_process').spawnSync;

function seeleClient() {
    // this.client1 = new seelejs("http://106.75.86.211:8037");
    // this.client2 = new seelejs("http://106.75.86.211:8038");

    // shardCount = 4
    this.client1 = new seelejs();
    this.client2 = new seelejs();
    this.client3 = new seelejs();
    this.client4 = new seelejs();


    this.accountArray = [];
    this.accountPath = os.homedir() + "/.seeleMist/account/";
    this.txPath = os.homedir() + "/.seeleMist/tx/";
    this.txArray = [];

    this.binPath = function () {
        var clientpath = `${__dirname}`;
        if (clientpath.indexOf("app.asar") > 0) {
            return clientpath.substring(0, clientpath.indexOf("app.asar")) + "/../client";
        } else {
            //TODO this works for dev environment, need to check path validity for packed exe
           // return "./cmd/win32/client"
            return clientpath + "/../../cmd/win32/client"
        }
    };

    this.nodePath = function() {
        var clientpath = `${__dirname}`;
        if (clientpath.indexOf("app.asar") > 0) {
            return clientpath.substring(0, clientpath.indexOf("app.asar")) + "/../node";
        } else {
            return "./cmd/win32/node"
        }
    };

    this.startNode = function () {
        return new Q((resolve, reject) => {
            try {
                var args = [
                    'start',
                ];
                args.push('-c')
                args.push('config\\node1.json')
                args.push('--accounts')
                args.push('config\\accounts.json')

                const proc = spawn(this.nodePath(), args);

                proc.stdout.on('data', data => {
                    resolve(true)
                });

                proc.stderr.on('data', data => {
                    reject(false)
                    alert(data.toString())
                });
            } catch (e) {
                alert(e)
                return reject(false)
            }
        });
    }

    this.solcPath = function() {
        var clientpath = `${__dirname}`;
        if (clientpath.indexOf("app.asar") > 0) {
            return clientpath.substring(0, clientpath.indexOf("app.asar")) + "/../solc";
        } else {
            return "./cmd/win32/solc"
        }
    };

    this.compileContract = function (input) {
        if (input != '') {

            return new Q((resolve, reject) => {
                try {
                    var args = [
                        '--combined-json',
                    ];
                    args.push("bin,abi,userdoc,devdoc")
                    args.push('--optimize')
                    args.push('--')
                    args.push('-')

                    const proc = spawn(this.solcPath(), args);
                    proc.stdin.write(input);
                    proc.stdin.end();

                    proc.stdout.on('data', data => {
                        var output = `${data}`
                        var contractBinaryCode = this.ParseContractBinaryCode(output)
                        resolve(contractBinaryCode)
                    });

                    proc.stderr.on('data', data => {
                        reject(data)
                        var output = document.getElementById("compileSuccess")
                        output.innerText = data.toString()
                        console.log(data.toString())
                        output.style.display = 'block'
                     });
                } catch (e) {
                    return reject(e)
                }
            });
        }
    };

    this.ParseContractBinaryCode = function (input) {
        try {
            input = JSON.parse(input)
            var contract = input.contracts['<stdin>:validUintContractTest'].bin
            return contract
        } catch (e) {
            return ""
        }
    };

    this.init = function () {
        if (!fs.existsSync(this.accountPath)) {
            fs.mkdirSync(os.homedir() + "/.seeleMist/")
            fs.mkdirSync(this.accountPath)
        }
    };

    this.generateKey = function (shardnum, passWord) {
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

    this.getshardnum = function (publicKey) {
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

    this.keyStore = function (fileName, privatekey, passWord) {
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

    this.DecKeyFile = function (fileName, passWord) {
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

    this.accountList = function () {
        if (fs.existsSync(this.accountPath)) {
            this.accountArray = fs.readdirSync(this.accountPath)
        } else {
            console.log(this.accountPath + "  Not Found!");
        }
    };

    this.getBalance = function (publicKey, callBack) {
        try {
            var numberInfo = this.getshardnum(publicKey)
            // shardCount = 4
            if (numberInfo == "1") {
                this.client1.getBalance(publicKey, "", -1, callBack);
            } else if (numberInfo == "2") {
                this.client2.getBalance(publicKey, "", -1, callBack);
            } else if (numberInfo == "3") {
                this.client3.getBalance(publicKey, "", -1, callBack);
            } else if (numberInfo == "4") {
                this.client4.getBalance(publicKey, "", -1, callBack);
            } else {
                alert(numberInfo)
            }
        } catch (e) {
            console.error("no node started in local host")
        }
    };

//     this.getBalanceSync = function (publicKey) {
//         try {
//             var numberInfo = this.getshardnum(publicKey)
//             if (numberInfo == "1") {
//                 return this.client1.sendSync("getBalance", publicKey);
//             } else if (numberInfo == "2") {
//                 return this.client2.sendSync("getBalance", publicKey);
//             } else if (numberInfo == "3") {
//                 return this.client3.sendSync("getBalance", publicKey);
//             } else if (numberInfo == "4") {
//                 return this.client4.sendSync("getBalance", publicKey);
//             } else {
//                 alert(numberInfo)
//             }
//         } catch (e) {
//             console.error("no node started in local host")
//         }
//     }

    this.sendtx = function (publicKey, passWord, to, amount, price, payload, callBack) {
        var client
        var numberInfo = this.getshardnum(publicKey)
        if (numberInfo == "1") {
            client = this.client1;
        } else if (numberInfo == "2") {
            client = this.client2;
        } else if (numberInfo == "3") {
            client = this.client3;
        } else if (numberInfo == "4") {
            client = this.client4;
        } else {
            alert(numberInfo)
            return
        }

        var nonce = client.sendSync("getAccountNonce", publicKey, "", -1);

        var rawTx = {
            "Type":0,
            "From": publicKey,
            "To": to,
            "Amount": parseInt(amount*Math.pow(10,8)),
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
            client.addTx(tx, function (info, err) {
                callBack(info, err, tx.Hash);
            });
        });
    };

    this.gettxbyhash = function (hash, publickey, callBack) {
        var client
        var numberInfo = this.getshardnum(publickey)
        if (numberInfo == "1") {
            client = this.client1;
        } else if (numberInfo == "2") {
            client = this.client2;
        } else if (numberInfo == "3") {
            client = this.client3;
        } else if (numberInfo == "4") {
            client = this.client4;
        } else {
            alert(numberInfo)
            return
        }
        client.getTransactionByHash(hash, callBack);
    }

    this.ParsePublicKey = function (input) {
        try {
            return input.substring(input.indexOf("publick key:") + 12, input.indexOf("private key:")).trim()
        } catch (e) {
            return ""
        }
    };

    this.ParsePrivateKey = function (input) {
        try {
            return input.substring(input.indexOf("private key:") + 12).trim()
        } catch (e) {
            return ""
        }
    };

    this.getblock = function (shard, hash, height, fulltx, callBack) {
        if (shard == "1") {
            this.client1.getBlock(hash, height, fulltx, callBack);
        } else if (shard == "2") {
            this.client2.getBlock(hash, height, fulltx, callBack);
        } else if (shard == "3") {
            this.client3.getBlock(hash, height, fulltx, callBack);
        } else if (shard == "4") {
            this.client4.getBlock(hash, height, fulltx, callBack);
        }
    };

    this.getblockheight = function (shard, callBack) {
        if (shard == "1") {
            this.client1.getBlockHeight(callBack);
        } else if (shard == "2") {
            this.client2.getBlockHeight(callBack);
        } else if (shard == "3") {
            this.client3.getBlockHeight(callBack);
        } else if (shard == "4") {
            this.client4.getBlockHeight(callBack);
        }
    };

    this.isListening = function (shard, callBack) {
        if (shard == "1") {
            this.client1.isListening(callBack);
        } else if (shard == "2") {
            this.client2.isListening(callBack);
        } else if (shard == "3") {
            this.client3.isListening(callBack);
        } else if (shard == "4") {
            this.client4.isListening(callBack);
        }
    };
    
    this.saveFile = function (isTx, hash) {
        if (!fs.existsSync(this.txPath)) {
            fs.mkdirSync(this.txPath)
        }
        var _path = this.txPath + hash
        fs.writeFile(_path, hash, function (err) {
            if (err)
                console.log(err.message)
        })
    }
    
    this.readFile = function () {
        if (fs.existsSync(this.txPath)) {
            this.txArray = fs.readdirSync(this.txPath)
        } else {
            console.log(this.txPath + "  Not Found!");
        }
    }
    
    this.queryContract = function (callBack) {
        let hash = $('#QueryHash').text()
        if (hash != null && hash != "" && hash != undefined) {
            var send = document.getElementById("contractPublicKey").value
            var numberInfo = this.getshardnum(send)
            if (numberInfo == "1") {
                return this.client1.getReceiptByTxHash(hash, "", callBack);
            } else if (numberInfo == "2") {
                return this.client2.getReceiptByTxHash(hash, "", callBack);
            } else if (numberInfo == "3") {
                return this.client3.getReceiptByTxHash(hash, "", callBack);
            } else if (numberInfo == "4") {
                return this.client4.getReceiptByTxHash(hash, "", callBack);
            }
        }
    }
}

module.exports = seeleClient;
