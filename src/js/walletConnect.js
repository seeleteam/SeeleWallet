// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var SeeleClient = require('../api/seeleClient');

seeleClient = new SeeleClient();
var shard
const fs = require('fs');
console.log(`WalletConnect is in ${__dirname}`)
var json = JSON.parse(fs.readFileSync(seeleClient.langPath.toString()).toString());

function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            oldonload();
            func();
        }
    }
}
addLoadEvent(firstLoad)

function firstLoad() {
    $('#shard').change(function() {
        connect();
    });
    connect();
}

// get the shard from GUI
function getShard() {
    shard = document.getElementById("shard").value;
    if (shard == "") {
        shard = "1"
    }
    return shard
}

function connect() {
    getShard()
    getNetWork()
    getBlockHeight()
    isListening()
}

function getNetWork() {
    var netWork = document.getElementById("netWork");
    //TODO change to hash from "./client getblock --height 0", which return genesis block hash
    // var mainNetWork = '0xc2c26507a9a7418c4cd4d1b405285397891d30f4d5be65af3be8b4c8e7c28d63'
    var mainNetWork1 = '0x4f2df4a21621b18c71619239c398657a23f198a40a8deff701e340e6e34d0823'
    var mainNetWork2 = '0x50dc657c1b2943d4d6d1ab23040e8cfdc7a3d34fa13bc95af1c569d1f07f66b8'
    var mainNetWork3 = '0x9100dd797bb7dd309ce7f132d389f1c6a50c728956eff0c2f878c0e67b5ecd2a'
    var mainNetWork4 = '0x17baaedc248777709511e9966719622fe11e4189825c5722f555bd292b6e84be'
    seeleClient.getblock(shard, "", 0, false, function (block,err) {
        const lang = document.getElementById("lang").value
        if (err) {
            netWork.innerText = json[lang]["privatenet"];
        } else {
            switch (block.hash) {
                case mainNetWork1:
                case mainNetWork2:
                case mainNetWork3:
                case mainNetWork4:
                    netWork.innerText = json[lang]["mainnet"];
                    break
                default:
                    netWork.innerText = json[lang]["privatenet"];
                    break
            }
        }
    });
}

function getBlockHeight() {
    setInterval(function(){
        var blockheight = document.getElementById("blockheight");
        // console.log(shard)
        seeleClient.getblockheight(shard, function (height,err) {
            if (err) {
                blockheight.innerText = 0;
            } else {
                blockheight.innerText = height;
            }
        });
    }, 2000);
}

function isListening() {
    setInterval(function(){
        var isListening = document.getElementById("isListening");
        seeleClient.isListening(shard, function (isListen,err) {
            const lang = document.getElementById("lang").value
            if (err) {
                isListening.innerText = json[lang]["disconnected"];
            } else {
                isListening.innerText = json[lang]["connected"];
            }
        });
    }, 2000);
}
