// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var SeeleClient = require('../api/seeleClient');

seeleClient = new SeeleClient();
const contractToAddress = "0x0000000000000000000000000000000000000000";
function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function () {
            oldonload();
            func();
        }
    }
}

addLoadEvent(function () {
    //TODO need to check the button
    document.getElementById("contractSourceCode").innerText = 'pragma solidity ^0.5.0; \n contract validUintContractTest { \n    function test() public pure { \n    } \n }';
    document.getElementById("compileContract").addEventListener("click", compileContract);
    document.getElementById("deployContract").addEventListener("click", depolyContract);
    document.getElementById("QueryContract").addEventListener("click", queryContract);
})

function compileContract() {
    var input = document.getElementById("contractSourceCode").innerText;
    seeleClient.compileContract(input).then((outdata) => {
        var getPayload = document.getElementById("getPayload");
        getPayload.innerText = outdata
        var output = document.getElementById("compileSuccess")
        output.innerText = "Success"
        output.style.display = 'block'
        if($('.cur').text() == 'CONTRACT BYTE CODE'){
            $('#contractInput').val(outdata)
        }
    }).catch((err) => {
        var output = document.getElementById("compileSuccess");
        output.innerText = err.toString();
        output.style.display = 'block'
    });
}

function depolyContract() {
    let payload = $('#getPayload').text()
    console.log(payload)
    if (payload != null && payload != "" && payload != undefined) {
        var publicKey = document.getElementById("contractPublicKey");
        var amount = document.getElementById("contractAmount");
        //var price = document.getElementById("price");
        var accountpassWord = document.getElementById("contractAccountpassWord")
        var gasPrice = $('.progress').slider("value");
        //get estimate gas
        var estimateGas=-1;
        seeleClient.estimateGas(publicKey.value,contractToAddress,"0x" + payload,function(result,err){
            if(err){
                alert(err)
            }else{
                estimateGas = result;
                layer.load(0, {
                    shade: false
                });
        
                seeleClient.sendtx(publicKey.value, accountpassWord.value,
                     "0x0000000000000000000000000000000000000000", amount.value,gasPrice,estimateGas, "0x" + payload, function (result, err, hash) {
                    layer.closeAll();
                    if (err) {
                        layer.alert(err.message)
                    } else {
                        var QueryHash = document.getElementById("QueryHash")
                        alert(hash)
                        QueryHash.innerText = hash
                        // seeleClient.txArray.push(hash)
                        seeleClient.txArray.push({"name":hash,"time":new Date().getTime()})
                        seeleClient.saveFile(false, hash)
                    }
                });
            }
        });       


        
    } else {
        alert("please compile the contract first!")
    }
}

function queryContract() {
    seeleClient.queryContract(function (err, result) {
        if (err) {
            alert(err.message)
        }else {
            var contractHash = document.getElementById("contractHash")
            contractHash.innerText = "contract:" + result.contract

            var contractDeployFailedOrNo = document.getElementById("contractDeployFailedOrNo")
            contractDeployFailedOrNo.innerText = "failed:" + result.failed

            var contractPoststate = document.getElementById("contractPoststate")
            contractPoststate.innerText = "poststate:" + result.poststate

            var contractResult = document.getElementById("contractResult")
            contractResult.innerText = "result:" + result.result

            var contractTota1Fee = document.getElementById("contractTota1Fee")
            contractTota1Fee.innerText = "tota1Fee:" + result.tota1Fee

            var contractTxhash = document.getElementById("contractTxhash")
            contractTxhash.innerText = "txhash:" + result.txhash

            var contractUsedGas = document.getElementById("contractUsedGas")
            contractUsedGas.innerText = "usedGas:" + result.usedGas
        }
    })
}
