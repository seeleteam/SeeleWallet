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
    //TODO need check event
    $('#tab ul li:eq(0)').click(function() {
        connect();
    });
    connect();
}

// get the shard from GUI
function getShard() {
    shard = document.getElementById("shard").innerText;
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
    //TODO need check the genesis hash of main netWork
    var mainNetWork = '0xc2c26507a9a7418c4cd4d1b405285397891d30f4d5be65af3be8b4c8e7c28d63'
    seeleClient.getblock(shard, "", 0, false, function (block,err) {
        if (err) {
            netWork.innerText = "private";
        } else {
            switch (block.hash) {
                case mainNetWork:
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
    }, 5000);
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
    }, 5000);
}
