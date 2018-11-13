// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var SeeleClient = require('../api/seeleClient');
var compiler = require('solc');
var CompilerHelper = require('../api/compilerHelper');

seeleClient = new SeeleClient();
compilerHelper = new CompilerHelper();
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
    document.getElementById("compileContract").addEventListener("click", compileContract);
    document.getElementById("deployContract").addEventListener("click", depolyContract);
})

function compileContract() {
    var payloadContract = document.getElementById("payload")
    var compileInfo = document.getElementById("compileInfo")
    try {
        var output = compiler.compileStandardWrapper(compilerHelper.compilerInput(payloadContract))
        output = JSON.parse(output)

        var button = true
        var compileErrors = output.errors
        for (var i = 0; i < compileErrors.length; i++) {
            var err = compileErrors[i]['severity']
            if (err == "error") {
                button = false
            }
        }
        compileInfo.innerText = JSON.stringify(compileErrors)

        if (button) {
            payload =  output.contracts['test.sol']['uintContractTest'].evm.bytecode.object
            compileInfo.innerText = "Success"
        }
    } catch (e) {
        compileInfo.innerText = e.toString()
    }
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
                //txresult.innerHTML = hash
            }
        });
    }
}
