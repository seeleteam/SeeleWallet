// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var SeeleClient = require('../api/seeleClient');
const BigNumber = require('bignumber.js');
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
var ctxvalidator;
addLoadEvent(function () {
    //TODO need to check the button
    document.getElementById("contractSourceCode").innerText = 'pragma solidity ^0.5.0; \n contract validUintContractTest { \n    function test() public pure { \n    } \n }';
    document.getElementById("compileContract").addEventListener("click", compileContract);
    document.getElementById("deployContract").addEventListener("click", depolyContract);
    document.getElementById("QueryContract").addEventListener("click", queryContract(""));
    $('#contractAmount').on('input',function(e){
        if(ctxvalidator.element("#contractAmount")){
            document.getElementById("ctxamount1").innerText=this.value;
            document.getElementById("ctxamount2").innerText=this.value;
            var estimatedgas = document.getElementById("ctx-estimatedgas").innerText;
            var gasPrice = $('#contractGasPrice').slider("value");
            var total = BigNumber(gasPrice).times(parseFloat(estimatedgas)).div(100000000).plus(parseFloat(this.value));
            document.getElementById("ctx-totalamount").innerText=total;
        }       
    });
    $("#contractGasPrice" ).on( "slidestop", function( event, ui ) {
        if(ctxvalidator.element("#contractAmount")){
            amount = document.getElementById("contractAmount").value;
        }else{
            amount= "0.0";
        }        
        var estimatedgas = document.getElementById("ctx-estimatedgas").innerText;
        var total = BigNumber(ui.value).times(parseFloat(estimatedgas)).div(100000000).plus(parseFloat(amount));
        document.getElementById("ctx-totalamount").innerText=total;
    } );

    ctxvalidator =   $('form[id="contractForm"]').validate({
        ignore: [],
        rules: {
            contractPublicKey: "required",
            contractAccountpassWord: {
                required:true
            },
            contractAmount:{
                required:true,
                number:true,
                fixedPrecision:8
            }
        },
        messages: {
            contractPublicKey: "Please enter your account address",
            contractAccountpassWord:{
                required:"Please enter your account password"
            },
            contractAmount:{
                required:"Please enter the transfer amount",
                number:"Amount should be a valid number",
                fixedPrecision:"The max precision is 8"
            }
        }
        // ,
        // errorPlacement: function(error, element) {
        //     error.insertAfter($(element).parent());
        // }
      });
      // add search contract event 
      $('#searchImg').on('click',function(e){        
        queryContract(document.getElementById("ctxHash").value);
    });
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
        // update estimated gas and total fee 
        var publicKey = document.getElementById("contractPublicKey");
        seeleClient.estimateGas(publicKey.value,contractToAddress,"0x" + outdata,function(result,err){
            if(err){
                alert("Get estimated gas error:" + err);
            }else{
                document.getElementById("ctx-estimatedgas").innerText=result;
                //update total fee
                if(ctxvalidator.element("#contractAmount")){
                    amount = document.getElementById("contractAmount").value;
                }else{
                    amount= "0.0";
                } 
                var gasPrice = $('#contractGasPrice').slider("value");
                var total = BigNumber(gasPrice).times(parseFloat(result)).div(100000000).plus(parseFloat(amount));
                document.getElementById("ctx-totalamount").innerText=total;
            }
        });
    }).catch((err) => {
        var output = document.getElementById("compileSuccess");
        output.innerText = err.toString();
        output.style.display = 'block'
    });
}

function depolyContract() {
    if(!ctxvalidator.form()){
        return;
    }
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
                        layer.alert("Deploy contract transaction Hash:"+ hash)
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

function queryContract(hash) {
    if(hash == ""){
        hash = $('#QueryHash').text();
    }
    seeleClient.queryContract(hash,function (result, err) {
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
            contractTota1Fee.innerText = "totalFee:" + result.totalFee

            var contractTxhash = document.getElementById("contractTxhash")
            contractTxhash.innerText = "txhash:" + result.txhash

            var contractUsedGas = document.getElementById("contractUsedGas")
            contractUsedGas.innerText = "usedGas:" + result.usedGas
        }
    })
}
