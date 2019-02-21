// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var SeeleClient = require('../api/seeleClient');
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
addLoadEvent(function() {
    document.getElementById("sendtx").addEventListener("click", sendtx);
    //document.getElementById("btn_gettx").addEventListener("click", gettxbyhash);
    $('#to').on('change',function(e){
        var from = document.getElementById("txpublicKey").value;
        var to = this.value;
        getEstimateGas(from,to);        
    });
    $('#amount').on('input',function(e){
        document.getElementById("txamount1").innerText=this.value;
        document.getElementById("txamount2").innerText=this.value;
        var estimatedgas = document.getElementById("estimatedgas").innerText;
        var gasPrice = $('.progress').slider("value");
        var total = BigNumber(gasPrice).times(parseFloat(estimatedgas)).div(100000000).plus(parseFloat(this.value));
        document.getElementById("totalamount").innerText=total;
    });
    $( ".progress" ).on( "slidestop", function( event, ui ) {
        var amount = document.getElementById("amount").value;
        if(amount == "undefined" || amount==""){
            amount= "0.0";
        }
        var estimatedgas = document.getElementById("estimatedgas").innerText;
        var total = BigNumber(ui.value).times(parseFloat(estimatedgas)).div(100000000).plus(parseFloat(amount));
        document.getElementById("totalamount").innerText=total;
    } );
})

function sendtx() {
    var publicKey = document.getElementById("txpublicKey");
    var to = document.getElementById("to");
    var amount = document.getElementById("amount");
    // var price = document.getElementById("price");
    var accountpassWord = document.getElementById("accountpassWord")

    layer.load(0, { shade: false });

    seeleClient.sendtx(publicKey.value, accountpassWord.value, to.value, amount.value, "10", "", function(result, err, hash) {
        layer.closeAll();
        if (err) {
            alert(err)
        } else {
            console.log(seeleClient.txArray)
            seeleClient.txArray.push(hash)
            seeleClient.saveFile(false, hash)
        }
    });
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
    seeleClient.estimateGas(from, to, function(info,err){
        if (err) {
            alert(err)
        } else {
            document.getElementById("estimatedgas").innerText=info;
        }
    })
}