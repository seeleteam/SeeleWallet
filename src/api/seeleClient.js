// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var seelejs = require('seeleteam.js');
var fs = require('fs');
var os = require("os")
var path = require('path');
var shell = require('shelljs');
var editFile = require("edit-json-file");
var process = require('process');
var tkill = require('tree-kill');
var ps = require('ps-node');

const Q = require('bluebird');
const spawn = require('child_process').spawn;
const spawnSync = require('child_process').spawnSync;
const editJsonFile = require("edit-json-file");

function seeleClient() {

    var shardCount = 4;

    // this.client1 = new seelejs("http://104.218.164.181:8037");
    // this.client2 = new seelejs("http://104.218.164.181:8038");
    // this.client3 = new seelejs("http://104.218.164.181:8039");
    // this.client4 = new seelejs("http://104.218.164.181:8036");

    // shardCount = 4

    this.client1 = new seelejs("http://localhost:8035");
    this.client2 = new seelejs("http://localhost:8032");
    this.client3 = new seelejs("http://localhost:8033");
    this.client4 = new seelejs("http://localhost:8034");


    this.accountArray = [];
    this.accountPath = os.homedir() + "/.SeeleWallet/account/";
    this.nodeConfigPath = os.homedir() + "/.SeeleWallet/node/";
    this.txPath = os.homedir() + "/.SeeleWallet/tx/";
    this.txArray = [];

    this.getOS = function () {
        var  osName="Unknown OS";
        
        if (os.type().indexOf("Win")!=-1)  osName="Windows";
        if (os.type().indexOf("Darwin")!=-1)  osName="MacOS";
        if (os.type().indexOf("Linux")!=-1)  osName="Linux";
        if (os.type().indexOf("X11")!=-1)  osName="UNIX";
        if (os.type().indexOf("Android")!=-1)  osName="Android";
        if (os.type().indexOf("iPhone")!=-1)  osName="iPhone";

        // console.log(osName);
        return osName;
    }

    this.binPath = function () {
        var clientpath = `${__dirname}`;
        // app.asar : An asar archive is a simple tar-like format that concatenates files into a single file.
        // Electron can read arbitrary files from it without unpacking the whole file.
        if (clientpath.indexOf("app.asar") > 0) {
            // return clientpath.substring(0, clientpath.indexOf("app.asar")) + "/../client";
            if(this.getOS() === "MacOS") {
                return clientpath.substring(0, clientpath.indexOf("app.asar")) + "mac/client";
            } else if(this.getOS() === "Windows") { //so far, we only provide win32
                return clientpath.substring(0, clientpath.indexOf("app.asar")) + "win/client";
            } else if(this.getOS() === "Linux") { 
                return clientpath.substring(0, clientpath.indexOf("app.asar")) + "linux/client";
            } else {
                console.log("the operation system may not be supported");
                return null;
            }
        } else {
            //TODO this works for dev environment, need to check path validity for packed exe
            // return "./cmd/win32/client"
            //console.log(this.getOS());
            if(this.getOS() === "MacOS") {
                return clientpath + "/../../cmd/mac/client";
            } else if(this.getOS() === "Windows") { //so far, we only provide win32
                return clientpath + "/../../cmd/win32/client";
            } else if(this.getOS() === "Linux") { 
                return clientpath + "/../../cmd/linux/client";
            } else {
                console.log("the operation system may not be supported");
                return null;
            }
        }
    };

    this.nodePath = function() {
        var clientpath = `${__dirname}`;
        if (clientpath.indexOf("app.asar") > 0) {
            // return clientpath.substring(0, clientpath.indexOf("app.asar")) + "/../node";
            if(this.getOS() === "MacOS") {
                return clientpath.substring(0, clientpath.indexOf("app.asar")) + "mac/node";
            } else if(this.getOS() === "Windows") { //so far, we only provide win32
                return clientpath.substring(0, clientpath.indexOf("app.asar")) + "win/node";
            } else if(this.getOS() === "Linux") { 
                return clientpath.substring(0, clientpath.indexOf("app.asar")) + "linux/node";
            } else {
                console.log("the operation system may not be supported");
                return null;
            }
        } else {
            //return "./cmd/win32/node";
            if(this.getOS() === "MacOS") {
                return clientpath + "/../../cmd/mac/node";
            } else if(this.getOS() === "Windows") { //so far, we only provide win32
                return clientpath + "/../../cmd/win32/node";
            } else if(this.getOS() === "Linux") { 
                return clientpath + "/../../cmd/linux/node";
            } else {
                alert("the operation system may not be supported");
                return null;
            }
        }
    };

    this.StartNode = function (shardNum, initiate) {
    
        return new Q((resolve, reject) => {
            try {
                var args = this.nonMiningArgs(shardNum);
                const proc = spawn(this.nodePath(), args);

                proc.stdout.on('data', data => {
                    resolve(data.toString())
                });
                proc.stderr.on('data', data => {
                    reject(data.toString())
                    // alert(data.toString())
                });
            } catch (e) {
                // alert(e)
                console.log(e.toString())
                return reject(false)
            }
        });
    }
    this.reStart = function(shardNum) {
        return new Q((resolve, reject) => {
            try {
                var args = [
                    'miner',
                    'stop'
                ];
                if (shardNum === 1) {
                    args.push('-a 127.0.0.1:8025');
                } else if(shardNum === 2){
                    args.push('-a 127.0.0.1:8022');
                } else if(shardNum === 3) {
                    args.push('-a 127.0.0.1:8023')
                } else if(shardNum === 4) {
                    args.push('-a 127.0.0.1:8024')
                }

                const proc = spawn(this.binPath(), args);

                proc.stdout.on('data', data => {
                    resolve(data);
                });

                proc.stderr.on('data', data => {
                    reject(data)
                });
            } catch (e) {
                return reject(e)
            }
        });
    }

    this.startMine = function(publickey) {
        var shardNum = this.getShardNum(publickey);
        this.killnode(shardNum);
        this.makeNodeFile(publickey, shardNum, false);
        this.execute('echo ')
        // this.execute('/Users/seele/go/src/github.com/seeleteam/SeeleWallet/cmd/mac/node start  -c /Users/seele/.SeeleWallet/node/node-1.json')
        
        // this.execute('nodeexc start  -c /Users/seele/.SeeleWallet/node/node-1.json')
        //start the mining node
        return new Q((resolve, reject) => {
            try {
                var args = this.miningArgs(shardNum)
                const proc = spawn(this.nodePath(), args);
                console.log(proc)
                this.execute('echo "starting mine before proc on"')
                proc.stdout.on('data', data => {
                    console.log(data.toString())
                    resolve(data.toString())
                });
                proc.stderr.on('data', data => {
                    reject(data.toString())
                });
            } catch (e) {
                // alert(e)
                console.log(e.toString())
                return reject(false)
            }
        });
    }

    this.makeNodeFile = function(account, shard, initiate) {
    // this.makeNodeFile = function (account, privatekey, shard) {
        // cp file and save into nodepath
        var configpath = `${__dirname}`+path.sep+'..'+path.sep+'..'+path.sep+'cmd'+path.sep+'config'+path.sep
        var nodefile = configpath + 'node'+shard+'.json'
        // var dstfile = this.nodeConfigPath+path.sep+'node-'+shard+'-'+account+'.json'
        var dstfile = this.nodeConfigPath+'node-'+shard+'.json'
        if (!fs.existsSync(this.nodeConfigPath)) {
            fs.mkdirSync(this.nodeConfigPath)
        }
        shell.cp('-f', nodefile, dstfile);        
        //replace files with right configs
        this.setUpNodeFile(dstfile, account, shard, initiate)
    } 

    this.setUpNodeFile = function(dstfile, account, shard, initiate){
        
        let file = editJsonFile(dstfile);   
        // Set a couple of fields
        file.set("basic.coinbase", ''+account);
        file.set("basic.dataDir", 'seeleWallet-node'+shard);
        file.set("ipcconfig.name", 'seeleWallet'+shard+'.ipc');
        //p2p privatekey
        if(initiate === true) {
            var args = [
                'key',
            ];
            args.push('--shard', shard)
            const proc = spawn(this.nodePath(), args);
    
            proc.stdout.on('data', data => {
                var output = `${data}`
                var privatekey = this.ParsePrivateKey(output)
                file.set("p2p.privateKey", ''+privatekey)
            });
        }
        // file.set("p2p.privateKey", ''+privatekey);

        // Save the data to the disk
        file.save();
        // Reload it from the disk
        file = editJsonFile(dstfile, {
            autosave: true
        });
    }
    
    this.nonMiningArgs = function(shard){
        var args = [
            'start',
        ];
        args.push('-c')
        args.push(this.nodeConfigPath+'node-'+shard+'.json')
        args.push('-m')
        args.push('stop')
        return args
    }
    this.miningArgs = function(shard){
        // var shard = this.getShardNum(account)
        var thread = 16;
        var args = [
            'start',
        ];
        args.push('-c');
        args.push(this.nodeConfigPath+'node-'+shard+'.json');
        args.push('--threads');
        args.push(thread);
        return args;
    }
    this.killnode = function (shardNum) {

        if (shardNum === '1'){     
            this.execute('ps -ef | grep "node-1.json" | grep -v grep | awk {\'print $2\'} | xargs kill -9');
            console.log("node-1 is killed");
       } else if (shardNum === '2'){
           this.execute('ps -ef | grep "node-2.json" | grep -v grep | awk {\'print $2\'} | xargs kill -9');
           console.log("node-2 is killed");
       } else if (shardNum === '3'){
           this.execute('ps -ef | grep "node-3.json" | grep -v grep | awk {\'print $2\'} | xargs kill -9');
           console.log("node-3 is killed");
       } else if (shardNum === '4'){
           this.execute('ps -ef | grep "node-4.json" | grep -v grep | awk {\'print $2\'} | xargs kill -9');
           console.log("node-4 is killed");
       } 
    }

    this.execute = function(command) {
        const exec = require('child_process').exec
        exec(command, (err, stdout, stderr) => {
            process.stdout.write(stdout)
        })
    }

    this.initateNodeConfig = function(shard) {
        var initiate = true
        var args = [
            'key',
        ];
        args.push('--shard', shard)
        const proc = spawn(this.nodePath(), args);

        proc.stdout.on('data', data => {
            var output = `${data}`
            var publickey = this.ParsePublicKey(output)
            this.makeNodeFile(publickey, shard, initiate)
        });
    }

    this.solcPath = function() {
        var clientpath = `${__dirname}`;
        if (clientpath.indexOf("app.asar") > 0) {
            // return clientpath.substring(0, clientpath.indexOf("app.asar")) + "/../solc";
            if(this.getOS() === "MacOS") {
                return clientpath.substring(0, clientpath.indexOf("app.asar")) + "mac/solc";
            } else if(this.getOS() === "Windows") { //so far, we only provide win32
                return clientpath.substring(0, clientpath.indexOf("app.asar")) + "win/solc";
            } else if(this.getOS() === "Linux") { 
                return clientpath.substring(0, clientpath.indexOf("app.asar")) + "linux/solc";
            } else {
                console.log("the operation system may not be supported");
                return null;
            }
        } else {
            // return "./cmd/win32/solc"
            if(this.getOS() === "MacOS") {
                return clientpath + "/../../cmd/mac/solc";
            } else if(this.getOS() === "Windows") { //so far, we only provide win32
                return clientpath + "/../../cmd/win32/solc";
            } else if(this.getOS() === "Linux") { 
                return clientpath + "/../../cmd/linux/solc";
            } else {
                alert("the operation system may not be supported");
                return null;
            }
        }
    };

    this.compileContract = function (input) {
        // if (input != '') {

            return new Q((resolve, reject) => {
                // try {
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
                // } catch (e) {
                //     return reject(e)
                // }
            });
        // }
    };

    this.ParseContractBinaryCode = function (input) {
        try {
            input = JSON.parse(input)
            // var contract = input.contracts['<stdin>:validUintContractTest'].bin
            var contracts = input.contracts;
            var contract;
            for(var key in contracts){
               contract =  contracts[key].bin;
            }
            return contract ;
        } catch (e) {
            return e.toString
        }
    };

    this.init = function () {
        if (!fs.existsSync(os.homedir() + "/.SeeleWallet/")) {
            fs.mkdirSync(os.homedir() + "/.SeeleWallet/")
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
                    // seeleClient.makeNodeFile(publickey,shardnum)
                    this.keyStore(publickey, privatekey, passWord)
                    resolve(publickey+privatekey)
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
                console.log(data.toString());
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

    this.sendtx = function (publicKey, passWord, to, amount, price, gaslimit,payload, callBack) {
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
            "GasLimit": parseInt(gaslimit),//3000000,
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
        }).catch((data) => {
            callBack("", new Error(data.toString()), "");
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

    this.getShardNum = function(publickey) {
            var numberInfo = this.getshardnum(publickey);
            return numberInfo;
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
            // this.txArray = fs.readdirSync(this.txPath)
            var dir = this.txPath;
            this.txArray = fs.readdirSync(dir)
              .map(function(v) { 
                  return { name:v,
                           time:fs.statSync(dir + v).mtime.getTime()
                         }; 
               })
               .sort(function(a, b) { return b.time - a.time; })
               .map(function(v) { return v; });
        } else {
            console.log(this.txPath + "  Not Found!");
        }
    }
    
    this.queryContract = function (hash,callBack) {
        // let hash = $('#QueryHash').text()
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

    this.estimateGas = function(from,to,payload,callBack) {
        var txData = {};
        txData.From = from;
        txData.To = to;
        txData.Amount = 0;
        txData.GasPrice = 0;
        txData.GasLimit = 63000;
        txData.AccountNonce = 9999999999;
        txData.Payload = payload;
        var tx = {};
        tx.Data = txData;
        var numberInfo = this.getshardnum(from);
        if (numberInfo == "1") {
            return this.client1.estimateGas(tx, callBack);
        } else if (numberInfo == "2") {
            return this.client2.estimateGas(tx, callBack);
        } else if (numberInfo == "3") {
            return this.client3.estimateGas(tx, callBack);
        } else if (numberInfo == "4") {
            return this.client4.estimateGas(tx, callBack);
        }
    }

}

  // this.stopMiner = function(publickey) {
    //     var shardNum = this.getShardNum(publickey);    
    //     var ip = [
    //         '127.0.0.1:8027',
    //         '127.0.0.1:8028',
    //         '127.0.0.1:8029',
    //         '127.0.0.1:8026',
    //     ];

    //     args.push(ip[shardNum-1]);
    //     return new Q((resolve, reject) => {
    //         try {
    //             var args = [
    //                 'miner',
    //                 'stop',
    //             ];
    //             args.push('-a')
    //             const proc = spawn(this.binPath(), args);
    //             console.log(proc)
    //             proc.stdout.on('data', data => {
    //                 resolve(data.toString())
    //             });
    //             proc.stderr.on('data', data => {
    //                 reject(data.toString())
    //                 // alert(data.toString())
    //             });
    //         } catch (e) {
    //             // alert(e)
    //             console.log(e.toString())
    //             return reject(false)
    //         }
    //     });
    // }

    // this.startMiner = function(publickey) {
    //     var shardNum = this.getShardNum(publickey);
    //     var args = [
    //         'miner',
    //         'start',
    //     ];
    //     args.push('-a')
    //     var ip = [
    //         '127.0.0.1:8027',
    //         '127.0.0.1:8028',
    //         '127.0.0.1:8029',
    //         '127.0.0.1:8026',
    //     ];

    //     args.push(ip[shardNum-1]);
    // }

module.exports = seeleClient;
