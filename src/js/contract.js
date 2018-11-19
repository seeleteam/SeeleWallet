// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var SeeleClient = require('../api/seeleClient');

seeleClient = new SeeleClient();
var payload

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
    //TODO need to check the button
    document.getElementById("compileContract").addEventListener("click", compileContract);
    document.getElementById("deployContract").addEventListener("click", depolyContract);
})

function compileContract() {
    //TODO need to compile the contract
    payload = ''
}

function depolyContract() {
    if (payload != null){
        var publicKey = document.getElementById("txpublicKey");
        var to = document.getElementById("to");
        var amount = document.getElementById("amount");
        //var price = document.getElementById("price");
        var accountpassWord = document.getElementById("accountpassWord")

        layer.load(0, { shade: false });

        seeleClient.sendtx(publicKey.value, accountpassWord.value, to.value, amount.value, "20000", payload, function(err, result, hash) {
            layer.closeAll();
            if (err) {
                alert(err)
            } else {
                console.info(hash)
                alert(hash)
            }
        });
    }
}
