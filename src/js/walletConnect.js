// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var SeeleClient = require('../api/seeleClient');

seeleClient = new SeeleClient();
var shard

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
    var mainNetWork1 = '0x93990984a6ca4414e798e9dd52578f300e493434d008f4dd7e7f1e313b22f95a'
    var mainNetWork2 = '0x2f1837f681618935bedb7cee045b6b5a610986bc1a9abc1f5e956950ef479b2b'
    var mainNetWork3 = '0x8d9b960d09122047a836ee6fad4ae91d1000aa6f1b6ecd7117ae779d8b10c231'
    var mainNetWork4 = '0xa6f046945a5e7a90fe7e7588d0a5b8607604c0aea25b9aa904737f1a3ed2152f'
    seeleClient.getblock(shard, "", 0, false, function (block,err) {
        if (err) {
            netWork.innerText = "private";
        } else {
            switch (block.hash) {
                case mainNetWork1:
                case mainNetWork2:
                case mainNetWork3:
                case mainNetWork4:
                    netWork.innerText = "main";
                    break
                default:
                    netWork.innerText = "private";
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
            if (err) {
                isListening.innerText = "Disconnected";
            } else {
                isListening.innerText = "Connecting";
            }
        });
    }, 2000);
}
