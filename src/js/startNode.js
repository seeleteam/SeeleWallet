// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var SeeleClient = require('../api/seeleClient');

seeleClient = new SeeleClient();

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

addLoadEvent(startNode)

function startNode() {
    seeleClient.startNode().then((outdata) => {
        console.log("1111111111111")
        console.log(outdata)
        if (outdata) {
            load()
        }
    }).catch(err => {
        startNode()
    });
}

function load() {
    require('./getBalance.js')
    require('./createAccount.js')
    require('./sendtx.js')
    require('./walletConnect.js')
    require('./contract.js')
}
