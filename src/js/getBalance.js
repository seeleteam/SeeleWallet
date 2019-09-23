const electron = require('electron');
var SeeleClient = require('../api/seeleClient');
seeleClient = new SeeleClient();

const fs = require('fs');
const json = JSON.parse(fs.readFileSync(seeleClient.langPath.toString()).toString());
const lang = document.getElementById("lang").value
let loadingBalances = false;
addLoadEvent(firstLoad);

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

function firstLoad() {
    loadAccount()
    switchLanguage()
    
    var interval1 = setInterval(function(){
        refreshBalances();
    }, 2000);
    
}

function loadAccount() {
    loadingBalances = true;
    seeleClient.accountList();
    
    if (seeleClient.txArray == null || seeleClient.txArray.length <= 0) {
        seeleClient.readFile();
    }

    if (seeleClient.accountArray.length > 0) {
        layer.load(0, {
            shade: false
        });
    }

    var count = 0;
    var tabs1 = document.getElementById("tabs-1");
    tabs1.innerHTML = "";

    var tabs1HTML = `<div id="main-container"><div><h1 class="lit" id="titleWallets">Accounts overview</h1></div></div>`
    tabs1HTML += `<div id="accountlist" style="display: block"> </div>`
    tabs1HTML += `<div style="display: block"><h3 class="latest-title lit" id="latestTransactions">Latest Transactions</h3></div>`
    tabs1HTML += `<div style="height: 300px; overflow-y: scroll;">`
    
    
    for(var item in seeleClient.txArray) {
        var time = new Date(seeleClient.txArray[item].time)
        tabs1HTML += `<div class="account-contact"><p class="contact-left">`
        tabs1HTML += `<span style='padding: 0px 10px 0px 10px; word-wrap: break-word'>`+time.toLocaleDateString()+` `+time.toLocaleTimeString()+`</span>`
        tabs1HTML += `</p>`
        tabs1HTML += `<ul class="contact-right">`
        tabs1HTML += `<li><span onclick="require('electron').shell.openExternal('https://seelescan.net/#/transaction/detail?txhash=`+seeleClient.txArray[item].name.trim() +`')">`+ seeleClient.txArray[item].name.trim() + `</span></li>`
        tabs1HTML += `</ul>`
        tabs1HTML += `</div>`
    }
    tabs1HTML += `</div>`
    tabs1.innerHTML = tabs1HTML
      
    //****************************************************************************************************************************************************************
    // var testHTML = ``
    // for (i = 0 ; i < 4 ; i++) {
     // testHTML += `<div class='account'> <div class='account-up'> <div class='account-logo'> <img class='img-cryptologo' src='./src/img/cryptologo-seele.png'> </div> <div class='account-balance'> 123456789.000 SEELE </div> </div> <div class='account-down'> <div class='account-controls'> <div class='account-publicKey'>0xbea2d3162d746b4af85b2e63a1d19f8cda6e32b1</div> <div class='account-copy'> <img class='img-copy' src='./src/img/square-copy.png'> </div> <div class='account-shard'> <div class='shardword' >片</div> <span class='shardnum'>1</span></div> <div class='account-contract'> <img class='img-solidity' src='./src/img/solidity.png'></div> <!-- <div class='account-more'> --> <div class='account-transaction'>交易</div> </div> <div class='account-file'>Michael</div> </div> </div>`
     
     // testHTML += `<div class='account'><div class='account-up'><div class='account-logo'> <img class='img-cryptologo' src='./src/img/cryptologo-seele.png'> </div><div class='account-balance'> 123456789.000 SEELE </div></div><div class='account-down'><div class='account-publicKey'>0xbea2d3162d746b4af85b2e63a1d19f8cda6e32b1</div><div class='account-copy'> <img class='img-copy' src='./src/img/square-copy.png'> </div><div class='account-shard'> <div class='shardword' >片</div> <span class='shardnum'>1</span></div> <div class='account-contract'>合约</div><div class='account-transaction'>交易</div><div class='account-file'>Michael_Shamering</div></div></div>`
     
     // testHTML += `<div class="accountFor" onclick="ToAccountInfo('0x14c741ab8ae794883c466224fda5d6f2bb5aee11',0.000,1)"><span class="accountImg"><img src="./src/img/Headportrait.png"></span><ul><li class="lit lit-account">账户</li><li><span class="accountBalance">0.000</span> SEELE</li><li>0x14c741ab8ae794883c466224fda5d6f2bb5aee11</li><li><span class="lit lit-shard">片</span><span>-</span>1</li></ul></div>`
    // }
    // var accountlist = document.getElementById("accountlist");
    // accountlist.innerHTML = testHTML;
    //****************************************************************************************************************************************************************


    for (var i in seeleClient.accountArray) {
        account  = seeleClient.accountArray[i];
        publicKey = account.pubkey;
        shardNum = account.shard;
        filename = account.filename;
        if (account.filename.length > 12 ) {
          filename  = '…'+account.filename.slice(-12);
        }
        
        shardWord = json[lang]['tb-shard'];
        send = json[lang]['tabSend'];
        balance = 0
        var accountHTML = ``
        accountHTML += `<div class='account'><div class='account-up'><div class='account-logo'> <img class='img-cryptologo' src='./src/img/cryptologo-seele.png'> </div><div class='account-balance'>`
        accountHTML += `<span id='`+ publicKey +`'>` + balance + '</span><span>SEELE</span>' + `</div> </div><div class='account-down'><div class='account-controls'>`
        accountHTML += `<div class='account-publicKey'>` + publicKey + `</div><div class='account-copy'>`
        accountHTML += `<img class='img-copy' onclick=toclip("`+publicKey+`") src='./src/img/square-copy.png'> </div><div class='account-shard'> `
        accountHTML += `<div class='shardword'>`+shardWord+`</div><span class='shardnum'>`+shardNum+`</span></div> <div class='account-contract'>` 
        accountHTML += `<img class='img-solidity' onclick=contract("`+publicKey+`") src='./src/img/solidity.png'></div>`
        accountHTML += `<div class='account-transaction' onclick=transaction("`+ publicKey +`") >`+ send +`</div></div>`
        accountHTML += `<div class='account-file'>`+ filename +`</div></div></div>`      
        document.getElementById("accountlist").innerHTML += accountHTML;
    }
    loadingBalances = false;
}

function toclip(text) {
  navigator.permissions.query({name: "clipboard-write"}).then(result => {
    if (result.state == "granted" || result.state == "prompt") {
      navigator.clipboard.writeText(text).then(
        function() {
        console.log("copied!")
      }, function() {
        console.log("failed, but still permitted")
      });
    }
  });
  
  selection.removeAllRanges();
  const fs = require('fs');
  var json = JSON.parse(fs.readFileSync(seeleClient.langPath.toString()).toString());
  const lang = document.getElementById("lang").value
  const copyMsg=json[lang]["copySucess"]
  layer.msg(copyMsg)
}

function getBalance() {
    var publicKey = document.getElementById("publicKey");

    seeleClient.getBalance(publicKey.value.trim(), function (err, info) {
        var balance = document.getElementById("balance");
        if (err) {
            try {
                var msg = JSON.parse(err.message);
                balance.innerText = msg.error.message;
            } catch (e) {
                balance.innerText = err.message;
            }
        } else {
            balance.innerText = "Balance：" + info.Balance;
        }
    });
}

function refreshBalances(){
    // if balance is being loaded (true) don't initiate the next load, 
    if(loadingBalances){
        return;
    }else{
        loadingBalances = true;
    }
    
    // use count for asynchronous: when it reaches account array size, loading is done (turn false)
    var count = 0;    
    var sum = 0;
    for (var item in seeleClient.accountArray) {
        seeleClient.getBalance(seeleClient.accountArray[item], function (info, err) {
            if (err) {
                console.log(err)
                count+=1;
            } else {
                document.getElementById(info.Account).innerText =  ( info.Balance / 100000000).toFixed(3);
                sum += info.Balance;
                count+=1;
            }
            if (count == seeleClient.accountArray.length) {
                document.getElementById('span_balance').innerText = (sum / 100000000).toFixed(3);
                loadingBalances = false;
                layer.closeAll();
            }
        })
    } 
}
