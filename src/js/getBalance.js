const electron = require('electron');
var SeeleClient = require('../api/seeleClient');
seeleClient = new SeeleClient();

const fs = require('fs');
const json = JSON.parse(fs.readFileSync(seeleClient.langPath.toString()).toString());
var lang = document.getElementById("lang").value
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

    var interval2 = setInterval(function(){
      updateRecords();
    }, 2000);
    // var interval2 = setInterval(function(){
    //     loadAccount();
    // }, 10000);

}

function beautifyTime(epochStr){
  var txdate = new Date(epochStr);
  var tostr = new Date().getTime();
  var yestr = todate-86400;
  var todate = new Date(tostr);
  var yedate = new Date(yestr);
  time = ''
  // if (txdate.toLocaleDateString()==todate.toLocaleDateString()){
  //   time += "今天 ";
  // } else if (txdate.toLocaleDateString()==yedate.toLocaleDateString()) {
  //   time += "昨天 ";
  // } else {
    time += txdate.toLocaleDateString().replace(/\//g,"-")
  // }
  time += " " + txdate.toLocaleTimeString()
  return time
}

function loadRecords() {
  // seeleClient.accountList();
  seeleClient.getRecords();

  recordHTML = ``
  recordHTML = `<div class="txrecord title">   <div class="tx-side lit" id="txBroadcastTime"> Broadcast Time </div>   <div class="from tx-mid">     <div class="content lit" id="rcFrom"> From </div>   </div>   <div class="to tx-mid">     <div class="content lit" id="rcTo">To</div>   </div>   <div class="amount tx-mid">     <div class="content lit" id="rcAmount">Amount</div>   </div>   <div class="txhash tx-mid">     <div class="content lit" id="rcTxhash">Transaction Hash</div>   </div>   <div class="status tx-side lit" id="rcStatus">Status</div> </div>`
  var lang = document.getElementById("lang").value
  for (var item of seeleClient.txRecords) {
      // updating items: time, hash, status
      // console.log(item);
      // on first load, make hash invisible status to be waiting,
      recordHTML += `<div class="txrecord table">`
      recordHTML += `<div class="time tx-side"> ` + beautifyTime(item.t) + ` </div>`
      recordHTML += `<div class="from tx-mid" onclick="toclip('`+ item.fa +`')"><div class="content">`+item.fa+`</div></div>`
      recordHTML += `<div class="to tx-mid" onclick="toclip('`+ item.ta +`')"><div class="content">`+item.ta+`</div></div>`
      recordHTML += `<div class="amount tx-mid"><div class="content">`+(item.m/100000000)+`<span> SEELE</span></div></div>`
      recordHTML += `<div class="txhash tx-mid" onclick="toclip('`+ item.s +`')"><div class="content">`+item.s+`</div></div>`

      if (item.fs==item.ts) { var ft = item.fs } else {var ft = item.fs + ` → ` + item.ts }
      // console.log(ft);
      if (item.u==2) {
        var status = "tx-wait"
      } else if (item.u==1) {
        var status = "tx-done"
      } else if (item.u==0) {
        var status = "tx-fail"
      }
      console.log(json[lang][status]);
      recordHTML += `<div class="status tx-side ` + status + `"><span class="`+status+`-word">`+json[lang][status]+`</span><span>` + ft + `</span></div>`
      recordHTML += `</div>`
  }
  var list = document.getElementById("txRecordList")
  list.innerHTML = recordHTML;
  // var switchLanguage = require('./language.js').switchLanguage
  switchLanguage();
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
    // tabs1.innerHTML = "";

    var tabs1HTML = `<div id="main-container"><div><h1 class="" id="titleWallets"></h1></div></div>`
    tabs1HTML += `<div id="accountlist" style="display: block"> </div>`
    tabs1HTML += `<div style="display: block"><h3 class="latest-title lit" id="latestTransactions">Latest Transactions</h3></div>`
    tabs1HTML += `<div id="txRecordList" style="display:block; height: 300px; overflow-y: scroll;"></div>`

    // tabs1HTML += `</div>`
    tabs1.innerHTML = tabs1HTML
    var lang = document.getElementById("lang").value
    for (var i in seeleClient.accountArray) {
        account = seeleClient.accountArray[i];
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

        accountHTML += `<div class='account'><div class='account-up'>`
        accountHTML += `<div class='account-logo'> <img class='img-cryptologo' src='./src/img/cryptologo-seele.png'> </div>`
        accountHTML += `<div class='account-balance'><span id='`+ publicKey +`'>` + balance + `</span><span> SEELE</span>`
        accountHTML += `</div></div>`
        accountHTML += `<div class='account-down'><div class='account-controls'>`
        accountHTML += `<div class='account-publicKey'>` + publicKey + `</div><div class='account-copy'><img class='img-copy' onclick=toclip("`+publicKey+`") src='./src/img/square-copy.png'> </div>`
        accountHTML += `<div class='account-shard'><div class='shardword'>`+shardWord+`</div><span class='shardnum'>`+shardNum+`</span></div> `
        accountHTML += `<div class='account-contract'><img class='img-solidity' onclick=contract(`+JSON.stringify(account)+`) src='./src/img/solidity.png'></div>`
        accountHTML += `<div class='account-transaction sendword' onclick=transaction(`+ JSON.stringify(account) +`) >`+ send +`</div></div>`
        accountHTML += `<div class='more' onclick=moreAbout(` + JSON.stringify(account)+`,"`+ shardWord + `")> <img class='img-more' src='./src/img/more.png'> </div>`
        accountHTML += `<div class='account-file'>`+ filename + `</div>`
        accountHTML += `</div></div>`

        document.getElementById("accountlist").innerHTML += accountHTML;
    }
    loadRecords();
    switchLanguage();
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

//expect an object and a string
function changeStatusTo(tx, status){
  console.log(tx);
  var oldPath = seeleClient.rcPath + JSON.stringify(tx);
  if (status == "done") {
    var tx2 = JSON.parse(JSON.stringify(tx))
    tx2.u = 1;
  } else if (status == "fail") {
    var tx2 = JSON.parse(JSON.stringify(tx))
    tx2.u = 0;
  } else {
    console.error("unknown status", status);
  }
  var newPath = seeleClient.rcPath + JSON.stringify(tx2);
  console.log(oldPath, newPath);
  var err = fs.renameSync(oldPath, newPath);
  if (err) {
    console.error(err);
  } else {
    records = 0;
  }
}

function updateRecords(){
  let records = 0;
  for (var item of seeleClient.txRecords.reverse()) {
    if (item.u==2 ) {
      if (records == 0){
        records = 1;
        console.log(item.t, "deal", item.u);
        seeleClient.verify(item, function(tx, status, debt){
          // console.log(tx.t, " is ", status, "but", tx.u);
          if (status == "done") {
            console.log("thus", tx ," should be changed");
            changeStatusTo(tx,"done");
            loadRecords();
          } else if (status == "fail") {
            //change to fail
            changeStatusTo(tx,"fail");
          } else if (status == "wait") {
            //do nothing
          } else if (status == "debt") {
            seeleClient.getDebtByHash(debt,tx.ts,function(result){
              // console.log(result.status);
              if(result.status == "block"){
                changeStatusTo(tx,"done");
                loadRecords();
              }
            })
            // console.log(tx, "is debt", debt);
          } else {
            console.error(item, "invalid status:", status);
          }
        })
      } else {
        console.log(item.t, "pend");
      }
    } else {
      // console.log();
    }
  }
}



module.exports = loadAccount;
