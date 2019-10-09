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
    document.getElementById("contractSourceCode").innerText = 'pragma solidity ^0.4.24; \n contract validUintContractTest { \n    function test() public pure { \n    } \n }';
    document.getElementById("compileContract").addEventListener("click", compileContract);
    document.getElementById("fdeployContract").addEventListener("click", deployContract);
    document.getElementById("femployContract").addEventListener("click", employContract);
    document.getElementById("contractInput").addEventListener("blur", estimateGas);
    // document.getElementById("fdeployContract").addEventListener("click", function(){console.log("sh!");});
    document.getElementById("searchImg").addEventListener("click", viewReceipt);
    document.getElementById("callImg").addEventListener("click", callContract);
    // document.getElementById("QueryContract").addEventListener("click", viewReceipt);
    
    $('#contractAmount').on('input',function(e){
        if(ctxvalidator.element("#contractAmount")){
            document.getElementById("ctxamount1").innerText=this.value;
            // document.getElementById("ctxamount2").innerText=this.value;
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

    ctxvalidator = $('form[id="contractForm"]').validate({
        ignore: [],
        rules: {
            contractPublicKey: "required",
            contractAddress: {
              rangelength:[42,42]
            },
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
            contractAddress: "Please enter contract address",
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
    $('#searchImg').on('click',function(){viewReceipt();});
    $('#callImg').on('click',function(){callContract();});
})

// function 
const Q = require('bluebird');
function promiseEstimateGas( from, to, load) {
  // console.log("from: ", from, "\nto: ", to, "\nload: ", load);
  return new Q((resolve, reject) => {
    seeleClient.estimateGas(from, to, load, function(result, err){
      console.log("result : ", result, "\nerror : ", JSON.stringify(err));
      if (err == undefined) {
        resolve(result)
      } else {
        reject(err)
      }
    });
    // if( true ){
    //   resolve(load)
    // } else {
    //   reject("hi")
    // }
  });
}

function deployContract(){
    if(!ctxvalidator.form()){
        return;
    }
    let payload = $('#getPayload').text()
    // console.log(payload)
    if (payload != null && payload != "" && payload != undefined) {
        var publicKey = document.getElementById("contractPublicKey");
        var account = document.getElementById("contractAddress")
        var amount = document.getElementById("contractAmount");
        //var price = document.getElementById("price");
        var accountpassWord = document.getElementById("contractAccountpassWord")
        var gasPrice = $('.progress').slider("value");
        //get estimate gas
        var estimateGas=-1;
        var from = publicKey.value;
        var load = "0x"+payload
        // if (document.getElementById("contractAddress").value == "") {
        var to = "0x0000000000000000000000000000000000000000";
        // } else {
          // var to = document.getElementById("contractAddress").value
        // }

        promiseEstimateGas(from, to, load).then(
          (estimatedgas)=>{
            console.log("returned",estimatedgas)
            var requested = false;

            setTimeout(function(){
              console.log(requested.toString());
              if (!requested) {
                const fs = require('fs');
                var json = JSON.parse(fs.readFileSync(seeleClient.langPath.toString()).toString());
                const lang = document.getElementById("lang").value
                alert(json[lang]["broadcastError"])
              }
            }, 5000);

            layer.load(0, { shade: false });
            console.log(from, accountpassWord.value, to, amount.value, gasPrice, estimatedgas, load);
            // console.log(seeleClient.address);
            var fromAccount = document.getElementById("ctAccount").value
            console.log(fromAccount);
            seeleClient.sendtx(fromAccount, accountpassWord.value, to, amount.value, gasPrice, estimatedgas, load, function(result, err, hash, txRecord) {
                layer.closeAll();
                requested = true;
                console.log(requested)
                if (err) {
                    layer.alert(err.message);
                } else {
                    const fs = require('fs');
                    var json = JSON.parse(fs.readFileSync(seeleClient.langPath.toString()).toString());
                    const lang = document.getElementById("lang").value
                    const createwarning0 = json[lang]["saveWarning0"];
                    const message = json[lang]["transactionSent"]+createwarning0+hash;
                    // seeleClient.txArray.push(hash)
                    alert(message)
                    navigator.permissions.query({name: "clipboard-write"}).then(result => {
                      if (result.state == "granted" || result.state == "prompt") {
                        navigator.clipboard.writeText(hash).then(
                          function() {
                          console.log("copied!")
                        }, function() {
                          console.log("failed, but still permitted")
                        });
                      }
                    });
                    seeleClient.txArray.push({"name":hash,"time":new Date().getTime()})
                    // seeleClient.saveFile(false, hash)
                    seeleClient.saveRecord(txRecord);
                    location.reload()
                }
            });
        }).catch((e)=>{console.error(e);})

    } else {
        const fs = require('fs');
        var json = JSON.parse(fs.readFileSync(seeleClient.langPath.toString()).toString());
        var settings = JSON.parse(fs.readFileSync(seeleClient.configpath), 'utf8')
        const lang = settings.lang;

        alert(json[lang]["lack binaries"])
    }
}

function employContract(){
  const fs = require('fs');
  var json = JSON.parse(fs.readFileSync(seeleClient.langPath.toString()).toString());
  var settings = JSON.parse(fs.readFileSync(seeleClient.configpath), 'utf8')
  const lang = settings.lang;
  
  if(!ctxvalidator.form()){
      return;
  }
  let payload = $('#getPayload').text()
  // console.log(payload)
  if (payload != null && payload != "" && payload != undefined) {
      var publicKey = document.getElementById("contractPublicKey");
      var account = document.getElementById("contractAddress")
      var amount = document.getElementById("contractAmount");
      //var price = document.getElementById("price");
      var accountpassWord = document.getElementById("contractAccountpassWord")
      var gasPrice = $('.progress').slider("value");
      //get estimate gas
      var estimateGas=-1;
      var from = publicKey.value;
      var load = "0x"+payload
      if (document.getElementById("contractAddress").value == "") {
        alert(json[lang]["EmployRequire"])
        return false;
      } else {
        var to = document.getElementById("contractAddress").value
      }

      promiseEstimateGas(from, to, load).then(
        (estimatedgas)=>{
          console.log("returned",estimatedgas)
          var requested = false;

          setTimeout(function(){
            console.log(requested.toString());
            if (!requested) {
              const fs = require('fs');
              var json = JSON.parse(fs.readFileSync(seeleClient.langPath.toString()).toString());
              const lang = document.getElementById("lang").value
              alert(json[lang]["broadcastError"])
            }
          }, 5000);

          layer.load(0, { shade: false });
          console.log(from, accountpassWord.value, to, amount.value, gasPrice, estimatedgas, load);
          // console.log(seeleClient.address);
          var fromAccount = document.getElementById("ctAccount").value
          console.log(fromAccount);
          seeleClient.sendtx(fromAccount, accountpassWord.value, to, amount.value, gasPrice, estimatedgas, load, function(result, err, hash, txRecord) {
              layer.closeAll();
              requested = true;
              console.log(requested)
              if (err) {
                  layer.alert(err.message);
              } else {
                  const fs = require('fs');
                  var json = JSON.parse(fs.readFileSync(seeleClient.langPath.toString()).toString());
                  const lang = document.getElementById("lang").value
                  const createwarning0 = json[lang]["saveWarning0"];
                  const message = json[lang]["transactionSent"]+createwarning0+hash;
                  // seeleClient.txArray.push(hash)
                  alert(message)
                  navigator.permissions.query({name: "clipboard-write"}).then(result => {
                    if (result.state == "granted" || result.state == "prompt") {
                      navigator.clipboard.writeText(hash).then(
                        function() {
                        console.log("copied!")
                      }, function() {
                        console.log("failed, but still permitted")
                      });
                    }
                  });
                  seeleClient.txArray.push({"name":hash,"time":new Date().getTime()})
                  // seeleClient.saveFile(false, hash)
                  seeleClient.saveRecord(txRecord);
                  location.reload()
              }
          });
      }).catch((e)=>{console.error(e);})

  } else {

      alert(json[lang]["lack binaries"])
  }
}

function viewReceipt() {
    // if (hash == "") {
    //   hash = $('#QueryHash').text();
    // }
    // console.log("lol");
    hash = document.getElementById("ctxHash").value
    shard = document.getElementById("receiptShard").innerText
    console.log(hash, shard);
    seeleClient.queryContract(shard, hash,function (result, err) {
        if (err) {
            alert(err.message)
        }else {
            var contractHash = document.getElementById("receipt-contractHash")
            contractHash.innerText = "contract:" + result.contract

            var contractDeployFailedOrNo = document.getElementById("receipt-contractDeployFailedOrNo")
            contractDeployFailedOrNo.innerText = "failed:" + result.failed

            var contractPoststate = document.getElementById("receipt-contractPoststate")
            contractPoststate.innerText = "poststate:" + result.poststate

            var contractResult = document.getElementById("receipt-contractResult")
            contractResult.innerText = "result:" + result.result

            var contractTota1Fee = document.getElementById("receipt-contractTota1Fee")
            contractTota1Fee.innerText = "totalFee:" + result.totalFee

            var contractTxhash = document.getElementById("receipt-contractTxhash")
            contractTxhash.innerText = "txhash:" + result.txhash

            var contractUsedGas = document.getElementById("receipt-contractUsedGas")
            contractUsedGas.innerText = "usedGas:" + result.usedGas
        }
    })
}

function callContract() {
  address = document.getElementById("callcontractAddress").value
  payload = document.getElementById("callcontractPayload").value
  shard = document.getElementById("callShard").innerText
  console.log( shard, payload, address );

  seeleClient.callContract(shard, payload, address, function (result, err) {
    // console.log(result);
    if (err) {
      console.error(err);
    } else {
      var contractHash = document.getElementById("call-contractHash")
      contractHash.innerText = "contract:" + result.contract

      var contractDeployFailedOrNo = document.getElementById("call-contractDeployFailedOrNo")
      contractDeployFailedOrNo.innerText = "failed:" + result.failed

      var contractPoststate = document.getElementById("call-contractPoststate")
      contractPoststate.innerText = "poststate:" + result.poststate

      var contractResult = document.getElementById("call-contractResult")
      contractResult.innerText = "result:" + result.result

      var contractTota1Fee = document.getElementById("call-contractTota1Fee")
      contractTota1Fee.innerText = "totalFee:" + result.totalFee

      var contractTxhash = document.getElementById("call-contractTxhash")
      contractTxhash.innerText = "txhash:" + result.txhash

      var contractUsedGas = document.getElementById("call-contractUsedGas")
      contractUsedGas.innerText = "usedGas:" + result.usedGas
    }  
  })
}

function compileContract(){
  var code = document.getElementById("contractSourceCode").innerText;
  // console.log(code);
  var input = {
    language: 'Solidity',
    sources: {
      'test.sol': {
        content: code
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };
  const { ipcRenderer } = require('electron');
  ipcRenderer.send('compileContract', input); 
  // const { ipcRenderer } = require('electron');
  ipcRenderer.on('compiledContract', (event, byt, abi, err ) => {
    
    if (err == null) {
      var output = document.getElementById("compileSuccess")
      output.innerText = "Success, ABI:\n"+JSON.stringify(abi)
      output.style.display = 'block'
      // console.log(byt);
      
      var getPayload = document.getElementById("getPayload");
      getPayload.innerText = byt
      
      if($('.cur')[0].id == 'contractByte'){
          $('#contractInput').val(byt)
          // $('#contractInput').innerText(outdata)
          // $('#contractInput').innerHTML(outda/ta)
          // $('#contractSourceCode').val(outdata)
      }
      var from = document.getElementById("contractPublicKey");
      // console.log(document.getElementById("contractAddress").value);
      if (document.getElementById("contractAddress").value == "") {
        var to = "0x0000000000000000000000000000000000000000";
      } else {
        var to = document.getElementById("contractAddress").value
      }
      
      seeleClient.estimateGas(from.value, to, "0x" + byt, function(result,err){
          console.log(result);
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
      
    } else {
      var output = document.getElementById("compileSuccess")
      output.innerText = JSON.stringify(err)
      output.style.display = 'block'
      console.error(JSON.stringify(err));
    }
  });
  
  // alert("done!")
}


function estimateGas(){
  console.log("triggered?");
  var from = document.getElementById("contractPublicKey").value;
  if (document.getElementById("contractAddress").value == "") {
    var to = "0x0000000000000000000000000000000000000000";
  } else {
    var to = document.getElementById("contractAddress").value;
  }
  var load = "0x" + document.getElementById("contractInput").value;
  
  console.log(from, to, load);
  promiseEstimateGas(from, to, load).then(
    (result)=>{
      console.log("returned",result)
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
  ).catch((e)=>{alert(e);})

}