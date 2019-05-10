os// this file contains all class functions within a constructor
// And thus, the order of variable initialization and function declaration matters
// Possible future implementations:
// Support more operating systems in this.GetOS()
// consideration when provided with invalid public keys or keyfiless

var seelejs = require('seeleteam.js');
var fs = require('fs');
var os = require("os")
var path = require('path');
var shell = require('shelljs');
var editFile = require("edit-json-file");
var process = require('process');
var tkill = require('tree-kill');
var ps = require('ps-node');
const Shell = require('node-powershell');
const Q = require('bluebird');
const spawn = require('child_process').spawn;
const spawnSync = require('child_process').spawnSync;
const editJsonFile = require("edit-json-file");

function seeleClient() {

  var shardCount = 4;
  this.client1 = new seelejs("http://localhost:8035");
  this.client2 = new seelejs("http://localhost:8032");
  this.client3 = new seelejs("http://localhost:8033");
  this.client4 = new seelejs("http://localhost:8034");
  this.nodeProcessArray = [];
  this.mineProcessArray = [];
  this.accountArray = [];
  this.txArray = [];
  this.walletPath = os.homedir() + path.sep + ".SeeleWallet" + path.sep;
  this.accountPath = this.walletPath + "account" + path.sep;
  this.nodeConfigPath = this.walletPath + "node" + path.sep;
  this.txPath = this.walletPath + "tx" + path.sep;
  this.PathSync = function(){
    console.log("PathSync!");
    try { fs.mkdirSync(this.accountPath); } catch (err){}
    try { fs.mkdirSync(this.nodeConfigPath); } catch (err){}
    try { fs.mkdirSync(this.txPath); } catch (err){}
  }

  this.GetOS = function() {
    var osName = "Unknown OS";

    if (os.type().indexOf("Win") > -1) osName = "Windows";
    else if (os.type().indexOf("Darwin") > -1) osName = "MacOS";
    else if (os.type().indexOf("Linux") > -1) osName = "Linux";

    return osName;
}

  this.os = this.GetOS();

  this.NodePath = function() {
    var clientpath = `${__dirname}`;
    if (this.os === "Unknown OS") { return "unsupported operating system"}
    if (clientpath.indexOf('app.asar') != -1){
      return clientpath.substring(0, clientpath.indexOf('app.asar') + this.os + path.sep +  'node')
    } else {
      return clientpath + path.sep + ".." + path.sep + ".." + path.sep + "cmd" + path.sep + this.os + path.sep + "node";
    }
  }

  this.ClientPath = function() {
    var clientpath = `${__dirname}`;
    if (this.os === "Unknown OS") { return "unsupported operating system"}
    if (clientpath.indexOf('app.asar') != -1){
      return clientpath.substring(0, clientpath.indexOf('app.asar') + this.os + path.sep +  'client')
    } else {
      return clientpath + path.sep + ".." + path.sep + ".." + path.sep + "cmd" + path.sep + this.os + path.sep + "client";
    }
  }

  this.nodePath = this.NodePath();

  this.clientPath = this.ClientPath();

  this.initateNodeConfig = function(shard) {
    var initiate = true
    var args = ['key', '--shard', shard];
    // args.push('--shard', shard);
    // console.log("common!!!");
    // console.log(this.nodePath);
    const proc = spawn(this.nodePath, args);

    proc.stdout.on('data', data => {
      var output = `${data}`
      var publickey = this.ParsePublicKey(output)
      this.makeNodeFile(publickey, shard, initiate)
    });
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

  this.StartNode = function(shardNum, initiate) {
    // this.KillNode(shardNum);
    console.log("start node ran!")
    return new Q((resolve, reject) => {
      try {
        var args = this.nonMiningArgs(shardNum);
        // console.log(this.nodePath
        // console.log(args);
        this.nodeProcessArray[shardNum] = spawn(this.nodePath, args);

        // console.log("started with", this.nodePath, args)
        this.nodeProcessArray[shardNum].stdout.on('data', data => {
          resolve(data.toString())
        });
        this.nodeProcessArray[shardNum].stderr.on('data', data => {
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

  this.StartMine = function(publickey) {
    console.log("returned 1 and execute!");

    var shardNum = this.getShardNum(publickey);
    // this.KillNode(shardNum);
    this.makeNodeFile(publickey, shardNum, false);
    return new Q((resolve, reject) => {
      try {
        var args = this.miningArgs(shardNum);
        const proc = spawn(this.nodePath, args);
        // this.execute('echo "starting mine before proc on"')
        proc.stdout.on('data', data => {
          console.log(data.toString())
          resolve(data.toString())
          console.log("output from StartMine")
        });
        proc.stderr.on('data', data => {
          reject(data.toString())
          console.log("Error from StartMine")
        });
      } catch (e) {
        // alert(e)
        console.log("failed to spawn")
        console.log(e.toString())
        return reject(false)
      }
    });
  }

  this.makeNodeFile = function(account, shard, initiate) {

    var configpath = `${__dirname}` + path.sep + '..' + path.sep + '..' + path.sep + 'cmd' + path.sep + 'config' + path.sep
    var nodefile = configpath + 'node' + shard + '.json'
    // var dstfile = this.nodeConfigPath+path.sep+'node-'+shard+'-'+account+'.json'
    var dstfile = this.nodeConfigPath + 'node-' + shard + '.json'
    if (!fs.existsSync(this.nodeConfigPath)) {
      fs.mkdirSync(this.nodeConfigPath)
    }
    shell.cp('-f', nodefile, dstfile);
    //replace files with right configs
    this.setUpNodeFile(dstfile, account, shard, initiate)
    console.log("finish creating node-",shard,".json for", account);
  }

  this.setUpNodeFile = function(dstfile, account, shard, initiate) {

    let file = editJsonFile(dstfile);
    // Set a couple of fields
    file.set("basic.coinbase", '' + account);
    file.set("basic.dataDir", 'seeleWallet-node' + shard);
    file.set("ipcconfig.name", 'seeleWallet' + shard + '.ipc');
    //p2p privatekey
    if (initiate === true) {
      var args = [
        'key',
      ];
      args.push('--shard', shard)
      const proc = spawn(this.nodePath, args);

      proc.stdout.on('data', data => {
        var output = `${data}`
        var privatekey = this.ParsePrivateKey(output)
        file.set("p2p.privateKey", '' + privatekey)
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

  this.nonMiningArgs = function(shard) {
    var args = [
      'start',
    ];
    args.push('-c')
    args.push(this.nodeConfigPath + 'node-' + shard + '.json')
    args.push('-m')
    args.push('stop')
    // var log = ' * > ' + this.nodeConfigPath + 'node' + shard +'.log';
    // args.push(log)
    return args
  }

  this.miningArgs = function(shard) {
    // var shard = this.getShardNum(account)
    var thread = 2;
    var args = [
      'start',
    ];
    args.push('-c');
    args.push(this.nodeConfigPath + 'node-' + shard + '.json');
    args.push('--threads');
    args.push(thread);
    return args;
  }

  this.KillNode = function(shardNum) {
    if (this.os === "Windows") {
      const ps = new Shell({
        executionPolicy: 'Bypass',
        noProfile: true
      });

      if (shardNum === '1') {
        ps.addCommand("Stop-Process $(Get-WmiObject Win32_Process | Select ProcessId, CommandLine | Select-String 'node-1.json'| % {$_ -replace '.*Id=', ''} | % {$_ -replace ';.*', ''})");
        ps.invoke().then(output => {
          console.log("node-1 is killed or already clear");
        }).catch(err => {
          console.log(err);
        });
      } else if (shardNum === '2') {
        ps.addCommand("Stop-Process $(Get-WmiObject Win32_Process | Select ProcessId, CommandLine | Select-String 'node-2.json'| % {$_ -replace '.*Id=', ''} | % {$_ -replace ';.*', ''})");
        ps.invoke().then(output => {
          console.log("node-2 is killed or already clear");
        }).catch(err => {
          console.log(err);
        });
      } else if (shardNum === '3') {
        ps.addCommand("Stop-Process $(Get-WmiObject Win32_Process | Select ProcessId, CommandLine | Select-String 'node-3.json'| % {$_ -replace '.*Id=', ''} | % {$_ -replace ';.*', ''})");
        ps.invoke().then(output => {
          console.log("node-3 is killed or already clear");
          return 1;
        }).catch(err => {
          console.log(err);
        });
      } else if (shardNum === '4') {
        ps.addCommand("Stop-Process $(Get-WmiObject Win32_Process | Select ProcessId, CommandLine | Select-String 'node-4.json'| % {$_ -replace '.*Id=', ''} | % {$_ -replace ';.*', ''})");
        ps.invoke().then(output => {
          console.log("node-4 is killed or already clear");
        }).catch(err => {
          console.log(err);
        });
      }

      return 1;
    } else {
      if (shardNum === '1') {
        this.execute('ps -ef | grep "node-1.json" | grep -v grep | awk {\'print $2\'} | xargs kill -9');
        console.log("node-1 is killed");
        return 1;
      } else if (shardNum === '2') {
        this.execute('ps -ef | grep "node-2.json" | grep -v grep | awk {\'print $2\'} | xargs kill -9');
        console.log("node-2 is killed");
        return 1;
      } else if (shardNum === '3') {
        this.execute('ps -ef | grep "node-3.json" | grep -v grep | awk {\'print $2\'} | xargs kill -9');
        console.log("node-3 is killed");
        return 1;
      } else if (shardNum === '4') {
        this.execute('ps -ef | grep "node-4.json" | grep -v grep | awk {\'print $2\'} | xargs kill -9');
        console.log("node-4 is killed");
        return 1;
      }
    }
  }

  this.execute = function(command) {
    const exec = require('child_process').exec
    exec(command, (err, stdout, stderr) => {
      process.stdout.write(stdout)
    })
  }

  this.solcPath = function() {
    var clientpath = `${__dirname}`;
    if (clientpath.indexOf("app.asar") > 0) {
      // return clientpath.substring(0, clientpath.indexOf("app.asar")) + "/../solc";
      if (this.os === "MacOS") {
        return clientpath.substring(0, clientpath.indexOf("app.asar")) + "mac/solc";
      } else if (this.os === "Windows") { //so far, we only provide win32
        return clientpath.substring(0, clientpath.indexOf("app.asar")) + "win/solc";
      } else if (this.os === "Linux") {
        return clientpath.substring(0, clientpath.indexOf("app.asar")) + "Linux/solc";
      } else {
        console.log("the operation system may not be supported");
        return null;
      }
    } else {
      // return "./cmd/win32/solc"
      if (this.os === "MacOS") {
        return clientpath + "/../../cmd/mac/solc";
      } else if (this.os === "Windows") { //so far, we only provide win32
        return clientpath + "\\..\\..\\cmd\\win32\\solc";
      } else if (this.os === "Linux") {
        return clientpath + "/../../cmd/Linux/solc";
      } else {
        alert("the operation system may not be supported");
        return null;
      }
    }
  };

  this.compileContract = function(input) {
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

  this.ParseContractBinaryCode = function(input) {
    try {
      input = JSON.parse(input)
      // var contract = input.contracts['<stdin>:validUintContractTest'].bin
      var contracts = input.contracts;
      var contract;
      for (var key in contracts) {
        contract = contracts[key].bin;
      }
      return contract;
    } catch (e) {
      return e.toString
    }
  }

  this.generateKey = function(shardnum, passWord) {
    // this.PathSync();
    return new Q((resolve, reject) => {
      try {
        var args = [
          'key',
        ];
        if (shardnum != "") {
          args.push('--shard', shardnum)
        }

        const proc = spawn(this.clientPath, args);

        proc.stdout.on('data', data => {
          var output = `${data}`
          var privatekey = this.ParsePrivateKey(output)
          var publickey = this.ParsePublicKey(output)
          // seeleClient.makeNodeFile(publickey,shardnum)
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
    const proc = spawnSync(this.clientPath, args);

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

      const proc = spawn(this.clientPath, args);

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

      const proc = spawn(this.clientPath, args);

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

  this.accountList = function() {
    if (fs.existsSync(this.accountPath)) {
      this.accountArray = fs.readdirSync(this.accountPath)
    } else {
      console.log(this.accountPath + "  Not Found!");
    }
  };

  this.getBalance = function(publicKey, callBack) {
    console.log("getBalance has, ", publicKey);
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

  this.sendtx = function(publicKey, passWord, to, amount, price, gaslimit, payload, callBack) {
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
      "Type": 0,
      "From": publicKey,
      "To": to,
      "Amount": parseInt(amount * Math.pow(10, 8)),
      "AccountNonce": nonce,
      "GasPrice": parseInt(price),
      "GasLimit": parseInt(gaslimit), //3000000,
      "Timestamp": 0,
      "Payload": payload
    }
    this.DecKeyFile(publicKey, passWord).then((data) => {
      var output = `${data}`
      var privatekey = this.ParsePrivateKey(output);
      var tx = client.generateTx(privatekey, rawTx);
      client.addTx(tx, function(info, err) {
        callBack(info, err, tx.Hash);
      });
    }).catch((data) => {
      callBack("", new Error(data.toString()), "");
    });
  };

  this.gettxbyhash = function(hash, publickey, callBack) {
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
  };

  this.getShardNum = function(publickey) {
    var numberInfo = this.getshardnum(publickey);
    return numberInfo;
  };

  this.getblock = function(shard, hash, height, fulltx, callBack) {
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

  this.getblockheight = function(shard, callBack) {
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

  this.isListening = function(shard, callBack) {
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

  this.saveFile = function(isTx, hash) {
    if (!fs.existsSync(this.txPath)) {
      fs.mkdirSync(this.txPath)
    }
    var _path = this.txPath + hash
    fs.writeFile(_path, hash, function(err) {
      if (err)
        console.log(err.message)
    })
  }

  this.readFile = function() {
    if (fs.existsSync(this.txPath)) {
      // this.txArray = fs.readdirSync(this.txPath)
      var dir = this.txPath;
      this.txArray = fs.readdirSync(dir)
        .map(function(v) {
          return {
            name: v,
            time: fs.statSync(dir + v).mtime.getTime()
          };
        })
        .sort(function(a, b) {
          return b.time - a.time;
        })
        .map(function(v) {
          return v;
        });
    } else {
      console.log(this.txPath + "  Not Found!");
    }
  }

  this.queryContract = function(hash, callBack) {
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

  this.estimateGas = function(from, to, payload, callBack) {
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

  this.clearshard = function(shard) {};

};

module.exports = seeleClient;
