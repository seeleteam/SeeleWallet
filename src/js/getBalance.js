// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var SeeleClient = require('../api/seeleClient');

seeleClient = new SeeleClient();

// onload = function() {
//     //document.getElementById("btnGetBalance").addEventListener("click", getBalance);
//     loadAccount();
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
addLoadEvent(firstLoad)

function firstLoad() {
    $('#tab ul li:eq(0)').click(function() {
        loadAccount();
    });
    loadAccount();
}

function loadAccount() {
    seeleClient.accountList();

    if (seeleClient.accountArray.length > 0) {
        layer.load(0, { shade: false });
    }

    var count = 0;
    var tabs1 = document.getElementById("tabs-1");
    tabs1.innerHTML = "";

    var tabs1HTML = `<h1>Accounts Overview</h1>`
    tabs1HTML += `<div id="accountlist"></div>`
    tabs1HTML += `<button class="add-account" onclick="addAccount()">`
    tabs1HTML += `<span><img src="./src/img/add.png"></span>`
    tabs1HTML += `<span>ADD ACCOUNT</span>`
    tabs1HTML += `</button>`
    tabs1HTML += `<p class="info">Accounts are password protected keys that can hold seele. They can control contracts, but can't display incoming transactions.</p>`

    tabs1.innerHTML = tabs1HTML


    for (var item in seeleClient.accountArray) {
        seeleClient.getBalance(seeleClient.accountArray[item].trim(), function(err, info) {
            if (err) {
                try {
                    var msg = JSON.parse(err.message);
                    alert(msg.error.message);
                } catch (e) {
                    alert(err.message);
                }
            } else {
                var accountlist = document.getElementById("accountlist");
                var accountHTML = ""
                accountHTML += `<div class="accountFor" onclick="ToAccountInfo('` + info.Account + `',` + info.Balance / 100000000 + `)">`;
                accountHTML += `<span class="accountImg"><img src="./src/img/Headportrait.png"></span>`;
                accountHTML += `<ul>`;
                accountHTML += `<li>Account</li>`;
                accountHTML += `<li><span>` + info.Balance / 100000000 + `</span> seele</li>`;
                accountHTML += `<li>` + info.Account + `</li>`;
                accountHTML += `</ul>`;
                accountHTML += `</div>`;
                accountlist.innerHTML += accountHTML;
                if (count == 0) {
                    document.getElementById("txpublicKey").value = info.Account;
                    span_balance.innerText = info.Balance / 100000000;
                }
                if (count == seeleClient.accountArray.length - 1) {
                    layer.closeAll();
                }
                count += 1;
            }
        });
    }
}

function getBalance() {
    var publicKey = document.getElementById("publicKey");
    seeleClient.getBalance(publicKey.value.trim(), function(err, info) {
        var balance = document.getElementById("balance");
        if (err) {
            try {
                var msg = JSON.parse(err.message);
                balance.innerText = msg.error.message;
            } catch (e) {
                balance.innerText = err.message;
            }
        } else {
            balance.innerText = "余额：" + info.Balance;
        }
    });
}