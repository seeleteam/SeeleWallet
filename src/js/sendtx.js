// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var SeeleClient = require('./src/api/seeleClient');
const BigNumber = require('bignumber.js');
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
var validator;
addLoadEvent(function() {
    document.getElementById("sendtx").addEventListener("click", sendtx);
    //document.getElementById("btn_gettx").addEventListener("click", gettxbyhash);
    $('#to').on('change',function(e){
        if(validator.element("#to")){
            var from = document.getElementById("txpublicKey").value;
            var to = this.value;
            getEstimateGas(from,to);
            detectShards(from,to);
        }
    });
    $('#amount').on('input',function(e){
        if(validator.element("#amount")){
            document.getElementById("txamount1").innerText=this.value;
            document.getElementById("txamount2").innerText=this.value;
            var estimatedgas = document.getElementById("estimatedgas").innerText;
            var gasPrice = $('#gasPrice').slider("value");
            var total = BigNumber(gasPrice).times(parseFloat(estimatedgas)).div(100000000).plus(parseFloat(this.value));
            document.getElementById("totalamount").innerText=total;
        }
    });
    $( "#gasPrice" ).on( "slidestop", function( event, ui ) {
        if(validator.element("#amount")){
            amount = document.getElementById("amount").value;
        }else{
            amount= "0.0";
        }
        var estimatedgas = document.getElementById("estimatedgas").innerText;
        var total = BigNumber(ui.value).times(parseFloat(estimatedgas)).div(100000000).plus(parseFloat(amount));
        document.getElementById("totalamount").innerText=total;
    } );
    validator =   $('form[id="txform"]').validate({
        // Specify validation rules
        rules: {
          // The key name on the left side is the name attribute
          // of an input field. Validation rules are defined
          // on the right side
          txpublicKey: "required",
          to: {
              required:true,
              rangelength:[42,42]
          },
          accountpassword: {
              required:true
          },
          amount:{
              required:true,
              number:true,
              fixedPrecision:9
          }
        },
        // Specify validation error messages
        messages: {
            txpublicKey: "Please enter your account address",
            to: {
                required:"Please enter a valid to address",
                rangelength:"Not a valid address"
            },
            accountpassword:{
                required:"Please enter your account password"
            },
            amount:{
                required:"Please enter the transfer amount",
                number:"Amount should be a valid number",
                fixedPrecision:"The max precision is 8"
            }
        }
      });
})

function sendtx() {

    if(!validator.form()){
        return;
    }

    var publicKey = document.getElementById("txpublicKey");
    var to = document.getElementById("to");
    var amount = document.getElementById("amount");
    // var price = document.getElementById("price");
    var accountpassWord = document.getElementById("accountpassWord")
    var estimatedgas = document.getElementById("estimatedgas").innerText;
    var gasPrice = $('.progress').slider("value");

    layer.load(0, { shade: false });
    seeleClient.sendtx(publicKey.value, accountpassWord.value, to.value, amount.value, gasPrice,estimatedgas, "", function(result, err, hash) {
        layer.closeAll();
        if (err) {
            layer.alert(err.message);
        } else {

            const fs = require('fs');
            var json = JSON.parse(fs.readFileSync(seeleClient.langPath.toString()).toString());
            const lang = document.getElementById("lang").value
            const createwarning0 = json[lang]["saveWarning0"];
            const message = json[lang]["transactionSent"]+hash;
            // seeleClient.txArray.push(hash)
            alert(createwarning0+message)
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
            seeleClient.saveFile(false, hash)
        }
    });
    // reset everything
    document.getElementById("accountpassWord").value='';
    document.getElementById("amount").value='';
    document.getElementById("to").value='';

}

function gettxbyhash() {
    var txresult = document.getElementById("txresult")
    var publicKey = document.getElementById("txpublicKey");
    seeleClient.gettxbyhash(txresult.innerHTML, publicKey.value, function(info, err) {
        if (err) {
            alert(err)
        } else {
            tx.innerHTML = JSON.stringify(info, "\t")
        }
    })
}

function getEstimateGas(from,to){
    seeleClient.estimateGas(from, to, "",function(info,err){
        if (err) {
            alert(err)
        } else {
            document.getElementById("estimatedgas").innerText=info;
        }
    })
}

function detectShards(from, to) {
    var shardFrom = seeleClient.getShardNum(from);
    var shardTo = seeleClient.getShardNum(to);
    const fs = require('fs');
    var json = JSON.parse(fs.readFileSync(seeleClient.langPath.toString()).toString());
    const lang = document.getElementById("lang").value

    var alertText = json[lang]["shardWarning"]["1"]+ shardFrom + json[lang]["shardWarning"]["2"] + shardTo + json[lang]["shardWarning"]["3"];
    // var detectshardfrom = document.getElementById("shardfrom");
    // var fromchange = detectshardfrom.childNodes[0];
    // fromchange.nodeValue = "From Shard: " + shardFrom;
    if (shardFrom != shardTo) {
        alert(alertText);
    }
}
