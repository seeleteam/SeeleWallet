// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var SeeleClient = require('../api/seeleClient');

seeleClient = new SeeleClient();

// onload = function() {
//     document.getElementById("sendtx").addEventListener("click", sendtx);
//     document.getElementById("btn_gettx").addEventListener("click", gettxbyhash);
// }
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
addLoadEvent(function() {
    document.getElementById("sendtx").addEventListener("click", sendtx);
    //document.getElementById("btn_gettx").addEventListener("click", gettxbyhash);
})

function sendtx() {
    var publicKey = document.getElementById("txpublicKey");
    var to = document.getElementById("to");
    var amount = document.getElementById("amount");
    //var price = document.getElementById("price");
    var accountpassWord = document.getElementById("accountpassWord")

    layer.load(0, { shade: false });

    seeleClient.sendtx(publicKey.value, accountpassWord.value, to.value, amount.value, "2000", "", function(err, result, hash) {
        layer.closeAll();
        if (err) {
            alert(err)
        } else {
            sessionStorage.setItem('transaction', hash)
        }
    });
}

function gettxbyhash() {
    var txresult = document.getElementById("txresult")
    var publicKey = document.getElementById("txpublicKey");
    seeleClient.gettxbyhash(txresult.innerHTML, publicKey.value, function(err, info) {
        if (err) {
            alert(err)
        } else {
            tx.innerHTML = JSON.stringify(info, "\t")
        }
    })
}